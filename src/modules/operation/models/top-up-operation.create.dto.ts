import { IsNumber, IsUUID } from 'class-validator';
import { Currency } from '../../../buisness-info/currencies';
import { IsCurrencyValid } from '../../../decorators/isCurrencyValid.decorator';

export class TopUpOperationCreateDto {
  @IsUUID()
  readonly accountId: string;
  
  @IsCurrencyValid()
  readonly currency: Currency;
  
  @IsNumber()
  amount: number;
}