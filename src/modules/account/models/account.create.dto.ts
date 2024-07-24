import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiCurrencyProperty } from '../../../../api-docs/custom-decorators/currency-api-property.decorator';

export class AccountCreateDto {
  @IsString()
  @ApiProperty({
    example: 'My first account',
    description: 'the shown name tag for account for quicker finding and identifying',
  })
  tag: string;
  
  @ApiCurrencyProperty()
  currency: string;
}