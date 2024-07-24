import { IsNumber } from 'class-validator';
import { ApiAccountIdProperty } from '../../../../api-docs/custom-decorators/accountId-api-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateIncomeInput {
  @ApiAccountIdProperty()
  readonly accountId: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Years after which the income will be calculated. ' +
      'Example: if year is 3, the result will show income after 3 years of active deposit',
    minimum: 1,
  })
  readonly years: number;
}