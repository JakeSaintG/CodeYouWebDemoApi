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

    // TODO: Write tests
    public addContactRequest = async (contactRequest: IContactRequest): Promise<IResponse> => {
        // TODO: Ensure data is IContactResponse. If not, return 400

        // Return early if there is an error with the expected files.
        if (!fs.existsSync(this.contactDataFileLocation) || !fs.existsSync('./contacts.db')) {
            return {
                code: 500,
                statusText: 'Server Error',
                message:
                    'Proper files not in place to add new contact request. Restart server or replace files to proceed.'
            };
        }
        
        // Generate unique ID for easy retrival later.
        contactRequest.id = uuidv4();

        // Add to database
        this.dbUtils.insertNewContactRequest(contactRequest);

        // Get contact JSON file data, add to it, and overwrite JSON file contents.
        let contactData = JSON.parse(fs.readFileSync(this.contactDataFileLocation, 'utf8'));
        contactData.push(contactRequest);
        fs.writeFileSync(this.contactDataFileLocation, JSON.stringify(contactData, null, 2));

        return {
            code: 201,
            statusText: 'OK',
            message: 'Successfully added contact request'
        };
    };

    // TODO: write tests
    public returnAllContactRequests = (): IResponse => {
        
        // Return early if there is an error with the expected files.
        if (!fs.existsSync(this.contactDataFileLocation) || !fs.existsSync('./contacts.db')) {
            return {
                code: 500,
                statusText: 'Server Error',
                message:
                    'Proper files not in place to add new contact request. Restart server or replace files to proceed.'
            };
        }

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
        } else {
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
        }
    };

    private resetDbFromTemplate = (templateJson: any) => {
        console.log('Dropping and resetting database from template.');
        
        let fileFound: boolean = false;

        if (fs.existsSync('./contacts.db')) { 
            fileFound = true;
            this.dbUtils.dropContactRequests();
        }

        this.dbUtils.createAndPopulateContactsTable(fileFound, templateJson);
    }; 

    private resetJsonFromTemplate = (templateJson: any) => {
        console.log('Creating or recreating JSON file from template.');  

        if (fs.existsSync(this.contactDataFileLocation)) {
            fs.rmSync(this.contactDataFileLocation); 
        } 

        fs.writeFileSync(this.contactDataFileLocation, JSON.stringify(templateJson, null, 2));
    };
}
