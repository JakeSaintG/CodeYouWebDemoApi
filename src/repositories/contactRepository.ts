import fs from 'fs';
import { IResponse } from '../interfaces/IResponse';

export class ContactRepository {
    private contactDataFileLocation = './src/files/contactData.json';
    private contactDataTemplateLocation = './src/files/contactDataTemplate.json';

    constructor() {}

    public initContactRequestData = () => {
        if (!fs.existsSync(this.contactDataFileLocation) /*&& db file not exist*/) {
            this.resetContactData();
        }
    };

    public addContactRequest = async (contactRequest: any) => {
        if (fs.existsSync(this.contactDataFileLocation) /*&& db file exist*/) {
            let contactData = JSON.parse(fs.readFileSync(this.contactDataFileLocation, 'utf8'));
            contactData.push(contactRequest);
            fs.writeFileSync(this.contactDataFileLocation, JSON.stringify(contactData, null, 2));
        } else {
            throw {
                code: 500,
                statusText: 'Server Error',
                message:
                    'Proper files not in place to add new contact request. Restart server or replace files to proceed.'
            };
        }
    };

    public returnAllContactRequests = () => {
        return JSON.parse(fs.readFileSync(this.contactDataFileLocation, 'utf8'));
    };

    public resetContactData = async (): Promise<IResponse> => {
        if (fs.existsSync(this.contactDataTemplateLocation)) {
            const templateJson = JSON.parse(
                fs.readFileSync(this.contactDataTemplateLocation, 'utf8')
            );
            this.resetDbFromTemplateData();
            this.resetJsonFileFromTemplate(templateJson);

            return {
                code: 201,
                statusText: 'OK',
                message: 'Data for contacts successfully reset.'
            };
        } else {
            const response = 'Template JSON file not found. Unable to set or reset contact data.';
            console.log(response);

            return {
                code: 500,
                statusText: 'Server Error',
                message: response
            };
        }
    };

    private resetDbFromTemplateData = () => {
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
