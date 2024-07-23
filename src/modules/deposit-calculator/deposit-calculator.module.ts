import { Module } from '@nestjs/common';
import { DepositCalculatorController } from './deposit-calculator.controller';
import { DepositCalculatorService } from './deposit-calculator.service';

@Module({
  controllers: [DepositCalculatorController],
  providers: [DepositCalculatorService],
  exports: [DepositCalculatorService],
})
export class DepositCalculatorModule {}
