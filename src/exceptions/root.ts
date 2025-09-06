
export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: any;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: any) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 1004,
    INTERNAL_SERVER_ERROR = 1005,
    UNAUTHORIZED=1006,
    PRODUCT_NOT_FOUND=2001
}