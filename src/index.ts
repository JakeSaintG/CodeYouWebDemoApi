import express, { Express, NextFunction, Request, Response, Router, response } from 'express';
import dotenv from 'dotenv';
import { ContactRepository } from './repositories/contactRepository';
import { DbUtils } from '../utils/dbutils';
const cors = require('cors');

// Get the configurable port from the .env file
dotenv.config();
const port = process.env.PORT;

// Spin up an express server instance and enable all CORS Requests.
// For more informaton on the CORS package, see here: https://expressjs.com/en/resources/middleware/cors.html
const app: Express = express();
app.use(express.json());
app.use(cors());

const dbUtils = new DbUtils();
const contactRepository: ContactRepository = new ContactRepository(dbUtils);
contactRepository.initContactRequestData();

// For this API, it is necessary to enable multiple routes to get or send different data.
const router: Router = express.Router();

// If a GET request is made with no route specified, return 'Code:You API Demo'.
router.get('/', (req: Request, res: Response) => {
    res.send('Code:You API Demo');
});

// If a GET request is made to the "contact" route, return all saved contact requests.
router.get('/contact', (req: Request, res: Response) => {
    try {
        const retrievalSource = process.env.RETRIEVE_FROM;
        const response = contactRepository.returnAllContactRequests(retrievalSource);

        res.status(response.code).json({
            status: response.code,
            statusText: response.statusText,
            message: response.message,
            data: response.data
        });
    } catch (error: unknown) {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            message: error
        });
    }
});

// If a POST request is made to the "contact" route, save the supplied contact request.
router.post('/contact', (req: Request, res: Response, next: NextFunction) => {
    contactRepository
        .addContactRequest(req.body)
        .then((responseMessage) =>
            res.status(responseMessage.code).json({
                status: responseMessage.code,
                statusText: responseMessage.statusText,
                message: responseMessage.message,
                data: responseMessage.data
            })
        )
        .catch((error: unknown) => {
            res.status(500).json({
                status: 500,
                statusText: 'Internal Server Error',
                message: error
            });
        });
});

// If a POST request is made to the "reset" route, reset to the default contact request data.
router.post('/reset', (req: Request, res: Response, next: NextFunction) => {
    contactRepository
        .resetContactData()
        .then((responseMessage) =>
            res.status(responseMessage.code).json({
                status: responseMessage.code,
                statusText: responseMessage.statusText,
                message: responseMessage.message
            })
        )
        .catch((error: unknown) => {
            res.status(500).json({
                status: 500,
                statusText: 'Internal Server Error',
                message: error
            });
        });
});

// If a DELETE request is made to the "clear" route, clear all data that is stored.
router.delete('/clearAll', (req: Request, res: Response, next: NextFunction) => {
    contactRepository
        .clearContactData()
        .then((responseMessage) =>
            res.status(responseMessage.code).json({
                status: responseMessage.code,
                statusText: responseMessage.statusText,
                message: responseMessage.message
            })
        )
        .catch((error: unknown) => {
            res.status(500).json({
                status: 500,
                statusText: 'Internal Server Error',
                message: error
            });
        });
});

app.use('/', router);

const server = app.listen(port, () => {
    console.log(
        `[server]: Server is running at http://localhost:${port}. You are now able to make calls to it.`
    );
});

process.on('SIGINT', () => {
    console.log(' - Exit command received. Closing server...');
    server.close();
});

process.on('uncaughtException', (error) => {
    if (error.message.includes('EADDRINUSE')) {
        console.error(
            `Port ${port} is already in use. \r\n` +
                `Either alter the port in the .env or follow instructions in README to terminate the process using port ${port}.`
        );
    }
});
