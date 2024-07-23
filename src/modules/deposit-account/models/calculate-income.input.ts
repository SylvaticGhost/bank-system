import { IsNumber, IsUUID } from 'class-validator';

export class CalculateIncomeInput {
  @IsUUID()
  readonly accountId: string;
  
  @IsNumber()
  readonly years: number;
}