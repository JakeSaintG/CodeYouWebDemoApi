import sqlite from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

export class DbUtils {
    
    public dbContext!: sqlite.Database;

    /*
        Create table:
            For the contact_id, it is totally valid to use an auto-incrementing ID instead of manually assigning one
            Notice that the rest of the columns do not specify a character length.
                In SQLite, the max size of a VARCHAR column is not enforced and not specifying is valid in a create statement.
    */
    private createContactsTable: string = `
        CREATE TABLE contacts (
            contact_id VARCHAR(36) PRIMARY KEY NOT NULL,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            pieces_of_interest VARCHAR NOT NULL,
            message VARCHAR NOT NULL
        ) 
    `;

    constructor() {
        
    }




// NEED TO PREVENT SQL INJECTION AS WELL






    public createDbContext = () => {
        this.dbContext = new sqlite.Database('./contacts.db', (error: Error | null) => {
            if (error) {
                console.error(`Error opening database: ${error.message}`);
            } else {
        
                this.dbContext.run(this.createContactsTable, (err: Error | null) => {

                    if (err && !err.message.includes("already exists")) {
                        console.log(err.message);
                    }
                    let insert = 'INSERT INTO contacts (contact_id, name, email) VALUES (?,?,?)';
                    this.dbContext.run(insert, [uuidv4(), "name", "email", "['piece one,'piece two']", "message"]);
                    this.dbContext.run(insert, [uuidv4(), "name", "email", "['piece one,'piece two']", "message"]); 
                    this.dbContext.run(insert, [uuidv4(), "name", "email", "['piece one,'piece two']", "message"]); 
                });
            }
        });
    }
}