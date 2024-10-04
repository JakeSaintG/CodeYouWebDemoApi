import { v4 as uuidv4 } from 'uuid';
import { Env } from '../env';
import type { ContactRequest } from '../types/contact-request';
import * as DbUtils from '../data/contact-requests';
import { HTTPError } from '../utils/http-error';
import { JsonTable } from '../utils/json-table';

// Set the JSON db parallel to the SQLite db. Normally, set variables with camelCase - but for
// stylistic reasons to match DbUtils, we'll use PascalCase here!
export const JsonUtils = new JsonTable<ContactRequest>({
    fileLocation: './files/contactData.json',
    defaultDataFileLocation: './files/contactDataDefault.json'
});

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

    throw new HTTPError({
        code: 400,
        message: 'Cannot transform object to ContactRequest. Missing required fields.'
    });
};

export class ContactRequestsCollection {
    public initContactRequestData = () => {
        JsonUtils.init();
        DbUtils.init({
            defaultData: JsonUtils.readDefaults()
        });
    };

    public addContactRequest = async (input: unknown): Promise<ContactRequest> => {
        // Return early if not valid contact request.
        const contactRequest: ContactRequest = castObjectToContactRequest(input);

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
        if (Env.RETRIEVE_FROM === 'database') {
            return DbUtils.selectAllContactRequests();
        } else if (Env.RETRIEVE_FROM === 'json') {
            return JsonUtils.read();
        } else {
            throw new Error(
                'Error in data retrieval configuration. Ensure RETRIEVE_FROM field in .env file is set to "database" or "json".'
            );
        }
    };

    public returnContactRequestById = (id: string) => {
        let contactRequest: ContactRequest | undefined;

        if (Env.RETRIEVE_FROM === 'database') {
            contactRequest = DbUtils.selectContactRequestById(id);
        } else if (Env.RETRIEVE_FROM === 'json') {
            contactRequest = JsonUtils.read().find((c) => c.id === id);
        } else {
            throw new Error(
                'Error in data retrieval configuration. Ensure RETRIEVE_FROM field in .env file is set to "database" or "json".'
            );
        }

        if (contactRequest === null || contactRequest === undefined) {
            throw new Error(
                `Unable to find find contact requestion with id: ${id}. Please check the ID and try again.`
            );
        }

        return contactRequest;
    };

    public resetContactData = (): void => {
        // Retrieve default data.
        const defaultData = JsonUtils.readDefaults();

        this.resetJson(defaultData);
        this.resetDb(defaultData);
    };

    public clearContactData = (): void => {
        // Write over contactData.json with an empty array.
        JsonUtils.clear();

        // Perform DELETE statement on contacts table (see dbUtils).
        DbUtils.deleteContactRequests();
    };

    public deleteContactRequestById = (id: string): void => {
        // Use a helper function (declared in this file) to remove an object from the JSON file.
        this.deleteFromJsonById(id);
        
        // Perform DELETE statement against database with ID (see dbUtils).
        DbUtils.deleteContactRequestById(id);
    };

    private resetDb = (newData: ContactRequest[]) => {
        console.log('Dropping and resetting database from template.');

        DbUtils.resetContactRequests(newData);
    };

    private resetJson = (newData: ContactRequest[]) => {
        JsonUtils.write(newData);
    };

    /*
    Why doesn't JsonUtils have a deleteById function?
        - The JsonUtilis/JsonTable functions were made to to perform actions on GENERIC objects in an array.
        - We can't be sure that a GENERIC object will have an id but we can be sure "outside" of the utils. After 
        we declare that the results are of type: JsonTable<ContactRequest>.
    */

    private deleteFromJsonById = (id: string) => {
        // Get current state of JSON
        const contactRequests = JsonUtils.read();

        // Use the ID to find the index of the contact request to delete
        const indexToRemove = contactRequests.findIndex((item) => item.id === id);

        // Remove item from array using index
        if (indexToRemove > -1) contactRequests.splice(indexToRemove, 1);

        // Over write JSON file using object with the removed contact request
        JsonUtils.write(contactRequests);
    };
}
