import { ErrorCode, HttpException } from "./root";

export class NotFoundException extends HttpException  {
    constructor(message: string = 'Not Found',errorCode: ErrorCode = null, errors: any = null) {
        super(message, errorCode, 404, errors);
    }
}