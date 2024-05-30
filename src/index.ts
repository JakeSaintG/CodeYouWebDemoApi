import express, { Express } from 'express';
import cors from 'cors';
// Allow async handlers to cleanly throw errors to the global error handler.
import 'express-async-errors';
import { Env } from './env';
import Routes from './routes';

// Spin up an express server instance and enable all CORS Requests.
// For more informaton on the CORS package, see here: https://expressjs.com/en/resources/middleware/cors.html
const app: Express = express();
app.use(express.json());
app.use(cors());

app.use('/', Routes);

const server = app.listen(Env.PORT, () => {
    console.log(
        `[server]: Server is running at http://localhost:${Env.PORT}. You are now able to make calls to it.`
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
                `Either alter the port in the .env or follow instructions in README to terminate the process using port ${port}.`
        );
    }
});
