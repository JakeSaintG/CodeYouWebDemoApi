/**
 * This is a special extension of Error that allows our application to specify an HTTP status code!
 * Our error handler in 'routes/index.ts' will use the code if it notices an error is of type
 * HTTPError
 */
export class HTTPError extends Error {
    code: number;

    constructor({ code, message }: { code: number, message: string }) {
        super(message);
        this.name = 'HTTPError';
        this.code = code;
    }
}