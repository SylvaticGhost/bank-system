export class Result {
    isSuccessful: boolean;
    statusCode: number;
    message: string;

    protected constructor(isSuccessful: boolean, message: string, statusCode: number = 200) {
        this.isSuccessful = isSuccessful;
        this.message = message;
        this.statusCode = statusCode;
    }

    static success(message: string, statusCode: number = 200) {
        return new Result(true, message, statusCode);
    }

    static fail(message: string, statusCode: number = 500) {
        return new Result(false, message, statusCode);
    }
}