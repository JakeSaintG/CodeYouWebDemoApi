/*
    NOTE: 
        I am choosing to use an interface here for simplicity.
        You may choose to create a Type instead and that's okay!
        https://www.typescriptlang.org/play/?#example/types-vs-interfaces
*/ 
export interface IResponse {
    code: number,
    statusText: string,
    message: string
}