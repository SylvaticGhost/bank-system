import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
    @IsEmail()
    @ApiProperty({type: String, description: 'Email of the user', example: 'test@email.com'})
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'Password of the user', example: 'password'})
    password: string;
}