import fs from 'fs';

export class JsonTable<E> {
    fileLocation: string;
    defaultDataFileLocation: string;

    constructor({
        fileLocation,
        defaultDataFileLocation,
    }: {
        fileLocation: string,
        defaultDataFileLocation: string
    }) {
        this.fileLocation = fileLocation;
        this.defaultDataFileLocation = defaultDataFileLocation;
    }

    init() {
        if (!fs.existsSync(this.fileLocation)) {
            this.write(this.readDefaults());
        }
    }

    readDefaults(): E[] {
        if (!fs.existsSync(this.defaultDataFileLocation)) {
            throw new Error('Template JSON file not found - please replace this file and restart the server. Ask a mentor for the file if you do not have a copy.');
        }

        return JSON.parse(fs.readFileSync(this.defaultDataFileLocation, 'utf8'));
    }

    read(): E[] {
        if (!fs.existsSync(this.fileLocation)) {
            throw new Error(`Data JSON file '${this.fileLocation}' not in place. POST to the reset endpoint, restart server, or replace files to proceed.`)
        }

        return JSON.parse(fs.readFileSync(this.fileLocation, 'utf8'));
    }

    write(json: E[]) {
        fs.writeFileSync(this.fileLocation, JSON.stringify(json, null, 2));
    }

    insert(entry: E) {
        let contactData = this.read();
        contactData.push(entry);
        this.write(contactData);
    }

    clear() {
        this.write([]);
    }
}