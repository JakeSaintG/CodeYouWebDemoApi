export class CollectionError extends Error {
    code: number;
    statusText: string;

    constructor({ code, message }: { code: number, message: string }) {
        super(message);
        this.name = 'CollectionError';
        this.code = code;
        this.statusText = code === 400 ? 'Bad Request' : 'Internal Server Error';
    }
}