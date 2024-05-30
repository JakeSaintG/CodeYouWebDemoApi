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

    readDefaults(): E[] {
        if (!fs.existsSync(this.defaultDataFileLocation)) {
            throw new Error('Template JSON file not found.');
        }

        return JSON.parse(fs.readFileSync(this.defaultDataFileLocation, 'utf8'));
    }

    read(): E[] {
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