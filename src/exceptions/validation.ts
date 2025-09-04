import { ErrorCode, HttpException } from "./root";

export class UnprocessableEntityException extends HttpException  {
    constructor(message: string = 'Validation Error', errorCode: ErrorCode, errors: any = null) {
        super(message, errorCode, 422, errors);
    }
}   