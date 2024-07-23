import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import {PrismaService} from "./data/prisma.service";
import { AccountModule } from './modules/account/account.module';
import { OperationModule } from './modules/operation/operation.module';
import {AdminModule} from "./modules/admin/admin.module";
import { DepositCalculatorModule } from './modules/deposit-calculator/deposit-calculator.module';
import { DepositAccountModule } from './modules/deposit-account/deposit-account.module';

@Module({
  imports: [UserModule, AdminModule, AccountModule, OperationModule, DepositCalculatorModule, DepositAccountModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
