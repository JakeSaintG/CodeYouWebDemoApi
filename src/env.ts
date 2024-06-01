import dotenv from 'dotenv';

// Get the configurable port from the .env file
dotenv.config();

const PORT: number = Number(process.env.PORT) || 8000;

// Do init validate here, so that you can see any errors as soon as the process starts
// If the value is not provided, then assume 'database' by default
const RETRIEVE_FROM = process.env.RETRIEVE_FROM?.toLowerCase() as 'json' | 'database' ?? 'database';

if (RETRIEVE_FROM !== 'json' && RETRIEVE_FROM !== 'database') {
    throw new Error(`RETRIEVE_FROM environment variable must be set to "json" or "database", it is: ${RETRIEVE_FROM}`);
}

export const Env = {
    RETRIEVE_FROM,
    PORT,
} as const;