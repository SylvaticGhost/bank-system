import { IsNumber } from 'class-validator';
import { Currency } from '../../../buisness-info/currencies';
import { ApiCurrencyProperty } from '../../../../api-docs/custom-decorators/currency-api-property.decorator';
import { ApiAccountIdProperty } from '../../../../api-docs/custom-decorators/accountId-api-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class TopUpOperationCreateDto {
  @ApiAccountIdProperty()
  readonly accountId: string;
  
  @ApiCurrencyProperty()
  readonly currency: Currency;
  
  @IsNumber()
  @ApiProperty({ type: 'number', example: 100, description: 'Amount of money to top up'})
  readonly amount: number;
}