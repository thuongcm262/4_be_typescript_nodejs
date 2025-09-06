import { HttpException } from "./root";

export class InternalException extends HttpException {
    constructor(message: string, errorCode: number, statusCode: number, errors: any) {
        super(message, errorCode, statusCode, errors);
    }
}