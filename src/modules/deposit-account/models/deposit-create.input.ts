import { AccountCreateDto } from '../../account/models/account.create.dto';
import { IsNumber } from 'class-validator';

export class DepositCreateInput extends AccountCreateDto {
  @IsNumber()
  depositAmount: number;
}