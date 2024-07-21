import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import {PrismaService} from "./data/prisma.service";
import { AccountModule } from './modules/account/account.module';
import { OperationModule } from './modules/operation/operation.module';
import {AdminModule} from "./modules/admin/admin.module";
import { DepositCalculatorModule } from './modules/deposit-calculator/deposit-calculator.module';
@Module({
  imports: [UserModule, AdminModule, AccountModule, OperationModule, DepositCalculatorModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
