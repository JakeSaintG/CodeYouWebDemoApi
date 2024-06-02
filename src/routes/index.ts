import express, { NextFunction, Request, Response, Router } from 'express';
import ContactRoutes from './contact-requests';
import { HTTPError } from '../utils/http-error';

// For this API, it is necessary to enable multiple routes to get or send different data.
const router: Router = express.Router();
export default router;

// If a GET request is made with no route specified, return 'Code:You API Demo'.
router.get('/', (req: Request, res: Response) => {
    res.send('Code:You API Demo');
});

// If a GET request is made to the /ping route, return 'healthy'.
router.get('/ping', (req: Request, res: Response) => {
    res.send();
});

router.use('/contact-requests', ContactRoutes);

/*
    This bit will catch any errors thrown in our routes.
    We can then inspect them to see if they are of type HTTPError, and respect the proposed code if
    it is!

    Either way - we can send the stack trace if it exists on the error, and use message as a backup.

    If all else fails - we send a generic error response.

    Note - In real apps, you may want to avoid passing the stacktrace (this could reveal private
    logic about how your code works to anyone with access to the client), but for instructional
    purposes this is ideal and lets you debug more easily!
 */
router.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);

    // If the error is an instance of our internal HTTPError, then use the `code` property from it
    if (error instanceof HTTPError) {
        res.status(error.code).contentType('text/plain').send(error.stack || error.message);
        next();
        return;
    }

    if (error instanceof Error) {
        res.status(500).contentType('text/plain').send(error.stack || error.message);
        next();
        return;
    }

    res.status(500).json({
        message: 'An unknown error occurred'
    });

    next();
});