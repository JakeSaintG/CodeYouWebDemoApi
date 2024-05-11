import { assert } from 'chai';
import { ContactRepository } from '../src/repositories/contactRepository';

const contactRepository = new ContactRepository();

describe("spinWords", () => {
    it("should pass some fixed tests", () => {
        assert.strictEqual(
            contactRepository.testMe() , "pass"
        );
    });
});