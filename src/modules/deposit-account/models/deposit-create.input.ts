import { AccountCreateDto } from '../../account/models/account.create.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositCreateInput extends AccountCreateDto {
  @IsNumber()
  @ApiProperty({
    example: 1000,
    description: 'start amount for deposit in currency as defined for account creation',
  })
  depositAmount: number;
}