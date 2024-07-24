import { IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferOperationCreateDto {
  @IsUUID()
  @ApiProperty({
    description: 'My account id from which the transfer is made',
    example: '79397ebb-747a-44da-b476-6b3831f57966',
    type: 'uuid',
  })
  myAccountId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Target account id to which the transfer is made',
    example: '79397ebb-747a-44da-b476-6b3831f57966',
    type: 'uuid',
  })
  targetAccountId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Amount to transfer',
    example: 100,
    type: 'number',
  })
  amount: number;

  @IsString()
  @ApiProperty({
    description: 'Description of the transfer',
    example: 'Transfer to John',
    type: 'string',
  })
  description: string;
}