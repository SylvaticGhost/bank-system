import {Result} from "./result";

export class TypeResult<T> extends Result {
    data: T;

    private constructor(isSuccessful: boolean, message: string, data: T, statusCode: number ) {
        super(isSuccessful, message, statusCode);
        this.data = data;
    }

    static success<T>(data: T, statusCode: number = 200) {
        return new TypeResult<T>(true, '', data, statusCode);
    }

    static fail<T>(message: string, statusCode: number = 500) {
        return new TypeResult<T>(false, message, null, statusCode);
    }
}