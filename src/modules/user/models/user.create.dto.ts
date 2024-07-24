import { IsString, IsEmail, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'First name of the user', example: 'John' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Last name of the user', example: 'Doe' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Email of the user', example: 'test@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Password of the user', example: 'password' })
  password: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Birthdate of the user in format YYYY-MM-DD',
    example: '1990-01-01',
  })
  birthdate: string;
}