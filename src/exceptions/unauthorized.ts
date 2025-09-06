import { HttpException } from "./root";

export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized', errorCode: number = null, errors?: any) {
        super(message, errorCode, 401, errors);
    }
}