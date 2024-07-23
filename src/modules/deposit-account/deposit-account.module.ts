import { Module } from '@nestjs/common';
import { DepositAccountController } from './deposit-account.controller';
import { DepositAccountService } from './deposit-account.service';
import { AccountModule } from '../account/account.module';
import { PrismaService } from '../../data/prisma.service';
import { OperationModule } from '../operation/operation.module';
import { DepositCalculatorModule } from '../deposit-calculator/deposit-calculator.module';

@Module({
  
  controllers: [DepositAccountController],
  imports: [AccountModule, OperationModule, DepositCalculatorModule],
  providers: [DepositAccountService, PrismaService],
})
export class DepositAccountModule {}
