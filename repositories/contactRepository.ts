import fs from 'fs';

export class ContactRepository {


    constructor() {}

    public initContactRequestData = () => {
        if (!fs.existsSync('./files/contactData.json') /*&& db file not exist*/) {
            this.resetContactData();
        }
    }

    public addContactRequest = async (contactRequest: any) => {
        // this.characterData.characters.push(character);
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
