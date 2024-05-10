import fs from 'fs';

export class ContactRepository {

    constructor() {}

    public initContactRequestData = () => {
        if (!fs.existsSync('./files/contactData.json') /*&& db file not exist*/) {
            this.resetContactData();
        }
    }

    public addContactRequest = async (contactRequest: any) => {

        if (fs.existsSync('./files/contactData.json') /*&& db file exist*/) {
            let contactData = JSON.parse(fs.readFileSync('./files/contactData.json', 'utf8'));
            
            contactData.push(contactRequest);
            // console.log(contactRequest);
            console.log(contactData);

            // save contactData.json with file contents 
        } else {
            throw {
                code: 500,
                statusText: 'bad request',
                message: 'Proper files not in place to add new contact request. Restart server or replace files to proceed.'
            };
        }
    }

    public returnAllContactRequests = () => {
        return JSON.parse(fs.readFileSync('./files/contactData.json', 'utf8'));
    };

    public resetContactData = async (): Promise<string> => {
        let response = 'Data for contacts successfully reset.';
        
        if (fs.existsSync('./files/contactDataTemplate.json')) {
            const templateJson = JSON.parse(fs.readFileSync('./files/contactDataTemplate.json', 'utf8'));
            this.resetDbFromTemplateData();
            this.resetJsonFileFromTemplate(templateJson);
        } else {
            response = 'Template JSON file not found. Unable to set or reset contact data.';
            console.error(response);
        }

        return response;
    }

    private resetDbFromTemplateData = () => {
        console.log('Dropping and resetting database from template.');
    }

    private resetJsonFileFromTemplate = (templateJson: any) => {
        console.log('Creating or recreating JSON file from template.');

        if (fs.existsSync('./files/contactData.json')) {
            fs.rmSync('./files/contactData.json');
        } 

        fs.writeFileSync('./files/contactData.json', JSON.stringify(templateJson, null, 2));
    }
}
