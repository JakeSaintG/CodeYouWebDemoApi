import express, { Request, Response, Router } from 'express';
import { ContactRequestsCollection } from '../collections/contact-requests';
import { CollectionError } from '../utils/collection-error';

const contactRepository: ContactRequestsCollection = new ContactRequestsCollection();
contactRepository.initContactRequestData();

const router: Router = express.Router();
export default router;

// If a GET request is made to the "contact" route, return all saved contact requests.
router.get('/', async (req: Request, res: Response) => {
    try {
        const contactRequests = await contactRepository.returnAllContactRequests();

        res.status(200).json(contactRequests);
    } catch (error: unknown) {
        // First log the error details to the console, for the developer (you!) to better understand
        // any issues
        console.error(error);

        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            message: error
        });
    }
});

// If a POST request is made to the "contact" route, save the supplied contact request.
router.post('/', async (req: Request, res: Response) => {
    try {
        const contactRequest = await contactRepository.addContactRequest(req.body);
        res.status(201).json({
            status: 201,
            statusText: 'OK',
            message: `Successfully added contact request with id ${contactRequest.id}`,
            data: contactRequest
        });
    } catch (error: unknown) {
        // First log the error details to the console, for the developer (you!) to better understand
        // any issues
        console.error(error);

        if (error instanceof CollectionError) {
            res.status(error.code).json({
                status: error.code,
                statusText: error.statusText,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            message: error
        });
    }
});

// If a POST request is made to the "reset" route, reset to the default contact request data.
router.post('/reset', async (req: Request, res: Response) => {
    await contactRepository.resetContactData();
    res.status(200).json({
        code: 200,
        statusText: 'OK',
        message: 'Data for contacts successfully reset.'
    });
});

// If a DELETE request is made to the "clear" route, clear all data that is stored.
router.delete('/clearAll', async (req: Request, res: Response) => {
    try {
        await contactRepository.clearContactData();
        res.status(200).json({
            code: 204,
            statusText: 'OK',
            message: 'Data for contacts successfully cleared.'
        });
    } catch (error: unknown) {
        // First log the error details to the console, for the developer (you!) to better understand
        // any issues
        console.error(error);

        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            message: error
        });
    }
});
