import express, { NextFunction, Request, Response, Router } from 'express';
import ContactRoutes from './contact-requests';
import { CollectionError } from '../utils/collection-error';

// For this API, it is necessary to enable multiple routes to get or send different data.
const router: Router = express.Router();
export default router;

// If a GET request is made with no route specified, return 'Code:You API Demo'.
router.get('/', (req: Request, res: Response) => {
    res.send('Code:You API Demo');
});

router.use('/contact-requests', ContactRoutes);

router.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);

    if (error instanceof CollectionError) {
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