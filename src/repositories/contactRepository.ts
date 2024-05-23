import fs from 'fs';
import { IResponse } from '../interfaces/IResponse';
import { IContactRequest } from '../interfaces/IContactRequest';
import { v4 as uuidv4 } from 'uuid';
import { DbUtils } from '../../utils/dbutils';

export class ContactRepository {
    private contactDataFileLocation = './src/files/contactData.json';
    private contactDataTemplateLocation = './src/files/contactDataTemplate.json';
    private dbUtils: DbUtils;

    constructor(dbUtils: DbUtils) {
        this.dbUtils = dbUtils;
    }

    public initContactRequestData = () => {
        if (!fs.existsSync(this.contactDataFileLocation) || !fs.existsSync('./contacts.db') ) {
            this.resetContactData();
        }
        this.dbUtils.setDbContext(); 
    };

    // Throw error if required fields are not present.
    private validateContactRequest = (potentialContact: any): IContactRequest => {

        if ('name' in potentialContact && 'email' in potentialContact && 'piecesOfInterest' in potentialContact && 'message' in potentialContact) {
            // Strip out any unnecessary fields. Ex: Phone number or if an ID is assigned from the front end.
            return {
                name: potentialContact.name,
                email: potentialContact.email,
                piecesOfInterest: potentialContact.piecesOfInterest,
                message: potentialContact.message
            };
        }
        
        throw new Error("Bad Request");
    }

    // TODO: Write tests
    public addContactRequest = async (request: IContactRequest): Promise<IResponse> => {
        // Return early if not valid contact request.
        let contactRequest: IContactRequest;
        try {
            contactRequest = this.validateContactRequest(request);
        } catch (error) {
            return {
                code: 400,
                statusText: 'Bad Request',
                message:
                    'Invalid Contact Request.'
            };
        }

        // Return early if there is an error with the expected files.
        const dataFilesError = this.ensureDataFilesExist();
        if (dataFilesError !== undefined) return dataFilesError;
        
        // Generate unique ID for easy retrival later.
        contactRequest.id = uuidv4();

        // Add to database
        this.dbUtils.insertNewContactRequest(contactRequest);

        // Get contact JSON file data, add to it, and overwrite JSON file contents.
        let contactData = JSON.parse(fs.readFileSync(this.contactDataFileLocation, 'utf8'));
        contactData.push(contactRequest);
        fs.writeFileSync(this.contactDataFileLocation, JSON.stringify(contactData, null, 2));

        // Return success with contactRequest data so frontend can utilize assigned ID. 
        return {
            code: 201,
            statusText: 'OK',
            message: `Successfully added contact request with id ${contactRequest.id}`,
            data: contactRequest
        };
    };

    public returnAllContactRequests = (): IResponse => {
        
        // Return early if there is an error with the expected files.
        const dataFilesError = this.ensureDataFilesExist();
        if (dataFilesError !== undefined) return dataFilesError;

        const contactData: IContactRequest = JSON.parse(
            fs.readFileSync(this.contactDataFileLocation, 'utf8')
        );

        return {
            code: 201,
            statusText: 'OK',
            message: 'Successfully returned contact requests',
            data: contactData
        };

    };

    public resetContactData = async (): Promise<IResponse> => {
        if (!fs.existsSync(this.contactDataTemplateLocation)) {
            const response = 'Template JSON file not found. Unable to set or reset contact data.';
            console.log(response);

            return {
                code: 500,
                statusText: 'Server Error',
                message: response
            };
        }

        const templateJson = JSON.parse(
            fs.readFileSync(this.contactDataTemplateLocation, 'utf8')
        );

        this.resetJsonFromTemplate(templateJson);
        this.resetDbFromTemplate(templateJson);

        return {
            code: 201,
            statusText: 'OK',
            message: 'Data for contacts successfully reset.'
        };
    };

    // TODO: Write tests
    public clearContactData = async (): Promise<IResponse> =>  {

        const dataFilesError = this.ensureDataFilesExist();
        if (dataFilesError !== undefined) return dataFilesError;

        fs.writeFileSync(this.contactDataFileLocation, JSON.stringify([], null, 2));
        this.dbUtils.deleteContactRequests();

        return {
            code: 201,
            statusText: 'OK',
            message: 'Data for contacts successfully cleared.'
        };
    }

    private resetDbFromTemplate = (templateJson: IContactRequest[]) => {
        console.log('Dropping and resetting database from template.');
        
        let fileFound: boolean = false;

        if (fs.existsSync('./contacts.db')) { 
            fileFound = true;
            this.dbUtils.dropContactRequests();
        }

        this.dbUtils.createAndPopulateContactsTable(fileFound, templateJson);
    }; 

    private resetJsonFromTemplate = (templateJson: IContactRequest[]) => {
        console.log('Creating or recreating JSON file from template.');  

        if (fs.existsSync(this.contactDataFileLocation)) {
            fs.rmSync(this.contactDataFileLocation); 
        } 

        fs.writeFileSync(this.contactDataFileLocation, JSON.stringify(templateJson, null, 2));
    };

    public ensureDataFilesExist = (): IResponse | undefined => {
        if (!fs.existsSync(this.contactDataFileLocation) || !fs.existsSync('./contacts.db')) {
            return {
                code: 500,
                statusText: 'Server Error',
                message:
                    'Proper files not in place. POST to the reset endpoint, restart server, or replace files to proceed.'
            };
        }
    }
}
