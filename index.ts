import express, { Express, NextFunction, Request, Response, Router, response } from "express";
import dotenv from "dotenv";
import { ContactRepository } from "./repositories/contactRepository"; 

const cors = require('cors');


dotenv.config();
const port = process.env.PORT;

const app: Express = express();
const contactRepository: ContactRepository = new ContactRepository();
const router: Router = express.Router();

app.use(express.json());
app.use(cors());

router.get("/", (req: Request, res: Response) => {
    res.send("Code:You API Demo");
});

router.get("/demo", (req: Request, res: Response) => {
    const data = contactRepository.returnAllContactRequests();

    res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "Success",
        "data": data
    });
});

router.post("/demo", (req: Request, res: Response, next: NextFunction) => {
    contactRepository.addContactRequest(req.body).then( (response) =>
        res.status(201).json({
            "status": 201,
            "statusText": "OK",
            "message": "Successfully added contact request",
            "data": req.body
        })
    ).catch(() => {
        res.status(400).json({
            "status": 400,
            "statusText": `Bad Request`,
            "message": `Error: ${response}`,
        });
    });
});

router.post("/reset", (req: Request, res: Response, next: NextFunction) => {

    contactRepository.resetContactData()
        .then( (responseMessage) =>
            res.status(201).json({
                "status": 201,
                "statusText": "OK",
                "message": responseMessage,
            }))
        .catch((responseMessage) => {
            res.status(500).json({
                "status": 400,
                "statusText": `Bad Request`,
                "message": `Server Error ${res.statusCode}: ${responseMessage}`,
            });
        });

});

app.use('/', router);

let server = app.listen(port, () => {
    console.log(`[server]:⚡️Server is running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    console.log('Exit command received. Closing server...');
    server.close(); 
});

process.on('uncaughtException', error => {
    if (error.message.includes('EADDRINUSE')) {
        console.error(
            `Port ${port} is already in use. \r\n` +
            `Either alter the port in the .env or follow instructions in README to terminate the process using port ${port}.`
        )
    }
});
