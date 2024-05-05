import express, { Express, NextFunction, Request, Response, Router } from "express";
import dotenv from "dotenv";
import { CharacterRepository } from "./repositories/characterRepository"; 

const cors = require('cors');

dotenv.config();

const app: Express = express();
const characterRepository: CharacterRepository = new CharacterRepository();
const port = process.env.PORT;
const router: Router = express.Router();

app.use(express.json());
app.use(cors());

router.get("/", (req: Request, res: Response) => {
    res.send("Character API Demo");
});

router.get("/demo", (req: Request, res: Response) => {
    const data = characterRepository.returnCharacterData();

    res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "Success",
        "data": data
    });
});

router.post("/demo", (req: Request, res: Response, next: NextFunction) => {

    characterRepository.addCharacterData(req.body).then( () =>
        res.status(201).json({
            "status": 201,
            "statusText": "OK",
            "message": "Successfully added character",
            "data": req.body
        })
    ).catch(() => {
        res.status(400).json({
            "status": 400,
            "statusText": `Bad Request`,
            "message": "Unable to add character",
        });
    });

});

app.use('/api/', router);

app.listen(port, () => {
    console.log(`[server]:⚡️Server is running at http://localhost:${port}`);
});

