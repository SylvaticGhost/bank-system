import { applyDecorators } from '@nestjs/common';
import { IsCurrencyValid } from '../../src/decorators/isCurrencyValid.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { CURRENCIES } from '../../src/buisness-info/currencies';

/**
 * Decorator wraps the `ApiProperty` decorator and sets the default response object for the method and IsCurrencyValid validation:
 * 
 * example: 'USD',
 * 
 * description: 'the currency for the account. Should be from available currencies list:' 
 */
export function ApiCurrencyProperty() {
  return applyDecorators(
    IsCurrencyValid(),
    ApiProperty({
      example: 'USD',
      description: 'the currency for the account. Should be from available currencies list:' +
        Object.values(CURRENCIES).join(', ')
    })
  )
}