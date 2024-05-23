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
        if (!fs.existsSync(this.contactDataFileLocation) || !fs.existsSync('./contacts.db')) {
            this.resetContactData();
        }
        this.dbUtils.setDbContext();
    };

    // Throw error if required fields are not present.
    private validateContactRequest = (potentialContact: any): IContactRequest => {
        if (
            'name' in potentialContact &&
            'email' in potentialContact &&
            'piecesOfInterest' in potentialContact &&
            'message' in potentialContact
        ) {
            // Strip out any unnecessary fields. Ex: Phone number or if an ID is assigned from the front end.
            // Ensure fields that are need to be strings are, indeed, strings.
            return {
                name: potentialContact.name.toString(),
                email: potentialContact.email.toString(),
                piecesOfInterest: potentialContact.piecesOfInterest.map((e: any) => e.toString()),
                message: potentialContact.message.toString()
            };
        }

        throw new Error('Bad Request');
    };

    public addContactRequest = async (request: IContactRequest): Promise<IResponse> => {
        // Return early if not valid contact request.
        let contactRequest: IContactRequest;
        try {
            contactRequest = this.validateContactRequest(request);
        } catch (error) {
            return {
                code: 400,
                statusText: 'Bad Request',
                message: 'Invalid Contact Request.'
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

    public returnAllContactRequests = (source: string | undefined): IResponse => {
        // Return early if there is an error with the expected files.
        const dataFilesError = this.ensureDataFilesExist();
        if (dataFilesError !== undefined) return dataFilesError;

        let contactData: IContactRequest[];

        if (source?.toLowerCase() === 'database' || source === undefined) {
            contactData = this.dbUtils.selectAllContactRequests();
        } else if (source?.toLowerCase() === 'json') {
            contactData = JSON.parse(fs.readFileSync(this.contactDataFileLocation, 'utf8'));
        } else {
            return {
                code: 500,
                statusText: 'Server Error',
                message: "Error in data retrieval configuration. Ensure RETRIEVE_FROM field in .env file is set to 'database' or 'json'." 
            };
        }

        return {
            code: 200,
            statusText: 'OK',
            message: `Successfully retrieved ${contactData.length} contact requests`,
            data: contactData
        };
    };

    public resetContactData = async (): Promise<IResponse> => {
        // Return early if template data is missing.
        if (!fs.existsSync(this.contactDataTemplateLocation)) {
            const response = 'Template JSON file not found. Unable to set or reset contact data.';
            console.log(response);

            return {
                code: 500,
                statusText: 'Server Error',
                message: response
            };
        }

        // Retrieve template data.
        const templateJson = JSON.parse(fs.readFileSync(this.contactDataTemplateLocation, 'utf8'));

        this.resetJsonFromTemplate(templateJson);
        this.resetDbFromTemplate(templateJson);

        return {
            code: 200,
            statusText: 'OK',
            message: 'Data for contacts successfully reset.'
        };
    };

    public clearContactData = async (): Promise<IResponse> => {
        const dataFilesError = this.ensureDataFilesExist();
        if (dataFilesError !== undefined) return dataFilesError;

        // Write over contactData.json with an empty array.
        fs.writeFileSync(this.contactDataFileLocation, JSON.stringify([], null, 2));

        // Perform DELETE statement on contacts table (see dbUtils).
        this.dbUtils.deleteContactRequests();

        return {
            code: 200,
            statusText: 'OK',
            message: 'Data for contacts successfully cleared.'
        };
    };

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
    };
}
