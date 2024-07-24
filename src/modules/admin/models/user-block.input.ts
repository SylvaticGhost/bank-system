import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserBlockInput {
  @IsUUID()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'User id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readonly userId: string;

  @IsString()
  @ApiProperty({
    description: 'Comment for understanding the reason for blocking/unblocking user',
    example: 'User is blocked because of spamming',
  })
  readonly comment: string;
}