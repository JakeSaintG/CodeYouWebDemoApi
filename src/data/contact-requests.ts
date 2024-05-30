import type { ContactRequest } from '../types/contact-request';
import sqlite from 'better-sqlite3';

// Note: This is a simplified understanding of how DB state management could be implemented.
// This implementation assumes that node will hold onto the connection (cache this module), and that
// the variable dbContext will always be in memory for node. This is fine for learning, but note
// it as something to look into if you ever scale up!
let dbContext: sqlite.Database;

export const fileLocation = './contact-requests.db';

export const setDbContext = () => {
    dbContext = new sqlite(fileLocation);
};

/*
    Set the characters that will separate array items when storing an array as a string in a DB.
    Double pipe characters were chosen to avoid issues with storing string that may contain commas or single pipes.
 */
const ARRAY_SEPARATOR = '||';

export const insertNewContactRequest = (contactReq: ContactRequest) => {
    const piecesOfInterest = contactReq.piecesOfInterest.join(ARRAY_SEPARATOR);
    const insert =
        'INSERT INTO contacts (contact_id, name, email, pieces_of_interest, message) VALUES (?,?,?,?,?)';
    dbContext
        .prepare(insert)
        .run([
            contactReq.id,
            contactReq.name,
            contactReq.email,
            piecesOfInterest,
            contactReq.message
        ]);
};

export const selectAllContactRequests = (): ContactRequest[] => {
    // Select all contact requests from database.
    const selectAllContactRequests: unknown[] = dbContext
        .prepare('SELECT * FROM contacts;')
        .all();

    // Transform each database row's columns into contact request object properties.
    // This could be immediately returned instead of assigning to a variable. However, it may be helpful to see that it is being assigned to an ContactRequest array.
    const contactRequestData: ContactRequest[] = selectAllContactRequests.map((e: any) => {
        // Assign each column to contact request property and reformat piecesOfInterest into an array.
        return {
            id: e.contact_id as string,
            name: e.name as string,
            email: e.email as string,
            piecesOfInterest: e.pieces_of_interest.split(ARRAY_SEPARATOR) as string[],
            message: e.message as string,
        }
    });

    return contactRequestData;
};

export const dropContactRequests = () => {
    dbContext.exec('DROP TABLE IF EXISTS contacts;');
};

export const deleteContactRequests = () => {
    dbContext.exec('DELETE FROM contacts;');
};

export const createAndPopulateContactsTable = (
    contactRequests: ContactRequest[]
) => {
    /*
        Create table:
            For the contact_id, it is totally valid to use an auto-incrementing ID instead of manually assigning one.
            Also, notice that all of the columns besides contact_id do not specify a character length.
                In SQLite, the max size of a VARCHAR column is not enforced and not specifying is valid in a create statement.
    */
    // getDbContext() will fix this
    dbContext.prepare(`
        CREATE TABLE IF NOT EXISTS contacts (
            contact_id VARCHAR(36) PRIMARY KEY NOT NULL,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            pieces_of_interest VARCHAR NOT NULL,
            message VARCHAR NOT NULL
        )
    `).run();

    contactRequests.forEach((contactReq: ContactRequest) => {
        insertNewContactRequest(contactReq);
    });
};