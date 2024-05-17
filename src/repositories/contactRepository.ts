import fs from 'fs';
import { IResponse } from '../interfaces/IResponse';
import { IContactRequest } from '../interfaces/IContactRequest';
import { v4 as uuidv4 } from 'uuid';

export class ContactRepository {
    private contactDataFileLocation = './src/files/contactData.json';
    private contactDataTemplateLocation = './src/files/contactDataTemplate.json';

    constructor() {}

    public initContactRequestData = () => {
        if (!fs.existsSync(this.contactDataFileLocation) /*&& db file not exist*/) {
            this.resetContactData();
        }
    };

    // TODO: Write tests
    public addContactRequest = async (contactRequest: IContactRequest): Promise<IResponse> => {
        // TODO: Ensure data is IContactResponse. If not, return 400

        if (!fs.existsSync(this.contactDataFileLocation) /*&& db file not exist*/) {
            return {
                code: 500,
                statusText: 'Server Error',
                message:
                    'Proper files not in place to add new contact request. Restart server or replace files to proceed.'
            };
        }

        /*
            No need for elses. If the file above did not exist or the data was formatted incorrectly, the if block would return early.
            If not, then the below return block would be hit. 
        */
        let contactData = JSON.parse(fs.readFileSync(this.contactDataFileLocation, 'utf8'));
        contactRequest.id = uuidv4()
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
        if (!fs.existsSync(this.contactDataFileLocation) /*&& db file not exist*/) {
            return {
                code: 500,
                statusText: 'Server Error',
                message:
                    'Proper files not in place to add new contact request. Restart server or replace files to proceed.'
            };
        }
        /*
            No need for elses. If the file above did not exist or the data was formatted incorrectly, the if block would return early.
            If not, then the below return block would be hit. 
        */
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
            this.resetDbFromTemplate();
            this.resetJsonFileFromTemplate(templateJson);

            return {
                code: 201,
                statusText: 'OK',
                message: 'Data for contacts successfully reset.'
            };
        }
    };

    // TODO: Do this
    private resetDbFromTemplate = () => {
        console.log('Dropping and resetting database from template.');
    };

    private resetJsonFileFromTemplate = (templateJson: any) => {
        console.log('Creating or recreating JSON file from template.');

        if (fs.existsSync(this.contactDataFileLocation)) {
            fs.rmSync(this.contactDataFileLocation);
        }

        fs.writeFileSync(this.contactDataFileLocation, JSON.stringify(templateJson, null, 2));
    };
}
