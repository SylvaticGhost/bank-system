import { ApiProperty } from '@nestjs/swagger';

export class Result {
    @ApiProperty({description: 'indicates that operation completed successfully' })
    isSuccessful: boolean;
    
    @ApiProperty({description: 'status code of the operation' })
    statusCode: number;
    
    @ApiProperty({description: 'message that describes the result, in success usually is empty' })
    message: string;

    protected constructor(isSuccessful: boolean, message: string, statusCode: number = 200) {
        this.isSuccessful = isSuccessful;
        this.message = message;
        this.statusCode = statusCode;
    }

    static success(message: string = '', statusCode: number = 200) {
        return new Result(true, message, statusCode);
    }

    static fail(message: string, statusCode: number = 500) {
        return new Result(false, message, statusCode);
    }
}