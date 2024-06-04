import express, { Express } from 'express';
import cors from 'cors';
// Allow async handlers to cleanly throw errors to the global error handler.
import 'express-async-errors';
import fs from 'fs';
import { Env } from './env';
import Routes from './routes';

// Spin up an express server instance and enable all CORS Requests.
// For more informaton on the CORS package, see here: https://expressjs.com/en/resources/middleware/cors.html
const app: Express = express();
app.use(express.json());
app.use(cors());

app.use('/', Routes);

fs.writeFileSync('./docs/port.json', JSON.stringify({port: Env.PORT}, null, 2)); 
app.use('/documentation', express.static('docs'));

const server = app.listen(Env.PORT, () => {
    console.log(
        `[server]: Server is running at http://localhost:${Env.PORT} and you are now able to make calls to it.\r\n`+
        `For use and documentation, visit http://localhost:${Env.PORT}/documentation`
    );
});

process.on('SIGINT', () => {
    console.log(' - Exit command received. Closing server...');
    server.close();
});

process.on('uncaughtException', (error) => {
    if (error.message.includes('EADDRINUSE')) {
        console.error(
            `Port ${Env.PORT} is already in use. \r\n` +
                `Either alter the port in the .env or follow instructions in README to terminate the process using port ${Env.PORT}.`
        );
    }
});
