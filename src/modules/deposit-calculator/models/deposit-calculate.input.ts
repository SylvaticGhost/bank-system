import { Currency } from '../../../buisness-info/currencies';
import { Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiCurrencyProperty } from '../../../../api-docs/custom-decorators/currency-api-property.decorator';

export class DepositCalculateInput {
  @ApiCurrencyProperty()
  readonly currency: Currency;
    
  @Min(1, { message: 'Amount must be greater than 0' })
  @ApiProperty({ type: Number, description: 'Amount of money to deposit', minimum: 1, example: 1000 })
  readonly amount: number;

  @Min(1, { message: 'Years must be greater than 0' })
  @ApiProperty({ type: Number, description: 'Number of years to deposit', minimum: 1, example: 1 })
  readonly years: number;
}