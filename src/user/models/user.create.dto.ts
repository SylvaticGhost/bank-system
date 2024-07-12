import { IsString, IsEmail, IsDateString, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsDateString()
    birthdate: string;
}