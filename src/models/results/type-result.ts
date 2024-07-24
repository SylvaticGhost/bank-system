import {Result} from "./result";
import { ApiProperty } from '@nestjs/swagger';

export class TypeResult<T> extends Result {
    @ApiProperty({description: 'The data that was requested or processed' })
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