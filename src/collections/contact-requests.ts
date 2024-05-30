import fs from 'fs';
import type { ContactRequest } from '../types/contact-request';
import { v4 as uuidv4 } from 'uuid';
// import * as DbUtils from '../data/contact-requests';
import { CollectionError } from '../utils/collection-error';
import { JsonTable } from '../utils/json-table';
import { ContactRequestsTable } from '../data/contact-requests-table';

const RETRIEVAL_SOURCE = process.env.RETRIEVE_FROM?.toLowerCase() as 'json' | 'database' | undefined;

if (RETRIEVAL_SOURCE !== 'json' && RETRIEVAL_SOURCE !== 'database' && RETRIEVAL_SOURCE) {
    throw new Error('RETRIEVE_FROM environment variable must be set to "json" or "database"');
}

// Set the JSON db parallel to the SQLite db. Normally, set variables with camelCase - but for
// stylistic reasons to match DbUtils, we'll use PascalCase here!
export const JsonUtils = new JsonTable<ContactRequest>({
    fileLocation: './files/contactData.json',
    defaultDataFileLocation: './files/contactDataDefault.json'
});
export const DbUtils = new ContactRequestsTable({
    fileLocation: './files/contactRequests.db'
});

const ensureDataFilesExist = () => {
    if (!fs.existsSync(JsonUtils.fileLocation) || !fs.existsSync(DbUtils.fileLocation)) {
        throw new CollectionError({
            code: 500,
            message: 'Proper files not in place. POST to the reset endpoint, restart server, or replace files to proceed.'
        })
    }
}

// Throw error if required fields are not present.
export const castObjectToContactRequest = (input: any): ContactRequest => {
    if (
        'name' in input &&
        'email' in input &&
        'piecesOfInterest' in input &&
        Array.isArray(input.piecesOfInterest) &&
        'message' in input
    ) {
        // Strip out any unnecessary fields. Ex: Phone number or if an ID is assigned from the front end.
        // Ensure fields that are need to be strings are, indeed, strings.
        return {
            name: input.name!.toString(),
            email: input.email!.toString(),
            piecesOfInterest: input.piecesOfInterest!.map((e: any) => e.toString()),
            message: input.message!.toString()
        };
    }

    throw new CollectionError({
        code: 400,
        message: 'Cannot transform object to ContactRequest. Missing required fields.'
    });
};

export class ContactRequestsCollection {
    public initContactRequestData = () => {
        DbUtils.setDbContext();
        if (!fs.existsSync(JsonUtils.fileLocation) || !fs.existsSync(DbUtils.fileLocation)) {
            this.resetContactData();
        }
    };

    public addContactRequest = async (input: unknown): Promise<ContactRequest> => {
        // Return early if not valid contact request.
        const contactRequest: ContactRequest = castObjectToContactRequest(input);

        // Throw early if there is an error with the expected files.
        ensureDataFilesExist();

        // Generate unique ID for easy retrieval later.
        contactRequest.id = uuidv4();

        // Add to database
        DbUtils.insertNewContactRequest(contactRequest);

        // Get contact JSON file data, add to it, and overwrite JSON file contents.
        JsonUtils.insert(contactRequest);

        // Return contactRequest so frontend can utilize assigned ID.
        return contactRequest;
    };

    // Use a string literal to specify the exact value of a string!
    public returnAllContactRequests = (): ContactRequest[] => {
        // Throw early if there is an error with the expected files.
        ensureDataFilesExist();

        if (RETRIEVAL_SOURCE === 'database' || undefined) {
            return DbUtils.selectAllContactRequests();
        } else if (RETRIEVAL_SOURCE === 'json') {
            return JsonUtils.read();
        } else {
            throw new CollectionError({
                code: 500,
                message: 'Error in data retrieval configuration. Ensure RETRIEVE_FROM field in .env file is set to "database" or "json".'
            });
        }
    };

    public resetContactData = (): void => {
        // Retrieve default data.
        const defaultData = JsonUtils.readDefaults();

        this.resetJson(defaultData);
        this.resetDb(defaultData);
    };

    public clearContactData = (): void => {
        ensureDataFilesExist();

        // Write over contactData.json with an empty array.
        JsonUtils.clear();

        // Perform DELETE statement on contacts table (see dbUtils).
        DbUtils.deleteContactRequests();
    };

    private resetDb = (newData: ContactRequest[]) => {
        console.log('Dropping and resetting database from template.');

        console.log('resetDb');
        if (fs.existsSync(DbUtils.fileLocation)) {
            DbUtils.dropContactRequests();
        }

        console.log('create and populate');
        DbUtils.createAndPopulateContactsTable(newData);
    };

    private resetJson = (newData: ContactRequest[]) => {
        JsonUtils.write(newData);
    };
}
