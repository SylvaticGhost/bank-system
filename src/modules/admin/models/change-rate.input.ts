import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiAccountIdProperty } from '../../../../api-docs/custom-decorators/accountId-api-property.decorator';

export class ChangeRateInput {
  @IsUUID()
  @ApiAccountIdProperty()
  readonly accountId: string;
  
  @IsNumber()
  @ApiProperty({description: 'new rate for account', example: 0.1, type: 'number'})
  readonly rate: number;
}