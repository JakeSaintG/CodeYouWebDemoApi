import express, { Request, Response, Router } from 'express';
import { ContactRequestsCollection } from '../collections/contact-requests';

const contactRepository: ContactRequestsCollection = new ContactRequestsCollection();
contactRepository.initContactRequestData();

const router: Router = express.Router();
export default router;

// If a GET request is made to the "contact" route, return all saved contact requests.
router.get('/', (req: Request, res: Response) => {
    if (req.query.id) {
        res.status(200).json(
            contactRepository.returnContactRequestById(req.query.id as string)
        );
    } else {
        res.status(200).json(contactRepository.returnAllContactRequests());
    }
});

// If a POST request is made to the "contact" route, save the supplied contact request.
router.post('/', async (req: Request, res: Response) => {
    const contactRequest = await contactRepository.addContactRequest(req.body);
    res.status(201).json(contactRequest);
});

// If a DELETE request is made to the "clear" route, clear all data that is stored.
// If the URL contains the query param ?reset=true, inject the default data to reset the collection!
router.delete('/', (req: Request, res: Response) => {
    if (req.query.reset) {
        contactRepository.resetContactData();
        res.status(200).send('Data for contacts successfully reset.');
    } if (req.query.id) {
        contactRepository.deleteContactRequestById(req.query.id as string);
        res.status(200).send(`Contact request with id ${req.query.id} successfully deleted.`);
    } else {
        contactRepository.clearContactData();
        res.status(200).send('Data for contacts successfully cleared.');
    }
});
