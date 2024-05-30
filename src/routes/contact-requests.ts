import express, { Request, Response, Router } from 'express';
import { ContactRequestsCollection } from '../collections/contact-requests';

const contactRepository: ContactRequestsCollection = new ContactRequestsCollection();
contactRepository.initContactRequestData();

const router: Router = express.Router();
export default router;

// If a GET request is made to the "contact" route, return all saved contact requests.
router.get('/', async (req: Request, res: Response) => {
    const contactRequests = await contactRepository.returnAllContactRequests();
    res.status(200).json(contactRequests);
});

// If a POST request is made to the "contact" route, save the supplied contact request.
router.post('/', async (req: Request, res: Response) => {
    const contactRequest = await contactRepository.addContactRequest(req.body);
    res.status(201).json(contactRequest);
});

// If a DELETE request is made to the "clear" route, clear all data that is stored.
// If the URL contains the query param ?reset=true, inject the default data to reset the collection!
router.delete('/', async (req: Request, res: Response) => {
    if (req.query.reset) {
        await contactRepository.resetContactData();
        res.status(200).send('Data for contacts successfully reset.');
    } else {
        await contactRepository.clearContactData();
        res.status(200).send('Data for contacts successfully cleared.');
    }
});
