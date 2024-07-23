import { IsNumber, IsUUID } from 'class-validator';

export class ChangeRateInput {
  @IsUUID()
  readonly accountId: string;
  
  @IsNumber()
  readonly rate: number;
}