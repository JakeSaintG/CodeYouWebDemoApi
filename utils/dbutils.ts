import sqlite from 'better-sqlite3';
import { IContactRequest } from '../src/interfaces/IContactRequest';

export class DbUtils {
    public dbContext!: sqlite.Database;

    /*
        Create table:
            For the contact_id, it is totally valid to use an auto-incrementing ID instead of manually assigning one.
            Also, notice that all of the columns besides contact_id do not specify a character length.
                In SQLite, the max size of a VARCHAR column is not enforced and not specifying is valid in a create statement.
    */
    private createContactsTable: string = `
        CREATE TABLE IF NOT EXISTS contacts (
            contact_id VARCHAR(36) PRIMARY KEY NOT NULL,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            pieces_of_interest VARCHAR NOT NULL,
            message VARCHAR NOT NULL
        ) 
    `;

    // Set the characters that will separate array items when storing an array as a string in a DB. 
    // Double pipe characters were chosen to avoid issues with storing string that may contain commas or single pipes.
    private arraySeparator = '||';

    constructor() {}

    public insertNewContactRequest = (contactReq: IContactRequest) => {
        const piecesOfInterest = contactReq.piecesOfInterest.join(this.arraySeparator);
        const insert =
            'INSERT INTO contacts (contact_id, name, email, pieces_of_interest, message) VALUES (?,?,?,?,?)';
        this.dbContext
            .prepare(insert)
            .run([
                contactReq.id,
                contactReq.name,
                contactReq.email,
                piecesOfInterest,
                contactReq.message
            ]);
    };

    public selectAllContactRequests = (): IContactRequest[] => {
        // Select all contact requests from database.
        const selectAllContactRequests: any[] = this.dbContext
            .prepare('SELECT * FROM contacts;')
            .all();

        // Transform each database row's columns into contact request object properties.
        // This could be immediately returned instead of assigning to a variable. However, it may be helpful to see that it is being assigned to an IContactRequest array.
        const contactRequestData: IContactRequest[] = selectAllContactRequests.map((e: any) => {
            // Assign each column to contact request property and reformat piecesOfInterest into an array.
            return {
                id: e.contact_id,
                name: e.name,
                email: e.email,
                piecesOfInterest: e.pieces_of_interest.split(this.arraySeparator),
                message: e.message
            }
        });

        return contactRequestData;
    };

    public dropContactRequests = () => {
        this.dbContext.exec('DROP TABLE IF EXISTS contacts;');
    };

    public deleteContactRequests = () => {
        this.dbContext.exec('DELETE FROM contacts;');
    };

    public createAndPopulateContactsTable = (
        fileFound: boolean,
        templateJson: IContactRequest[]
    ) => {
        if (!fileFound) {
            this.setDbContext();
        }

        this.dbContext.prepare(this.createContactsTable).run();

        templateJson.forEach((contactReq: IContactRequest) => {
            this.insertNewContactRequest(contactReq);
        });
    };

    public setDbContext = () => {
        this.dbContext = new sqlite('./contacts.db');
    };
}
