import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import {PrismaService} from "./data/prisma.service";
import { AccountModule } from './modules/account/account.module';
import { OperationModule } from './modules/operation/operation.module';
import {AdminModule} from "./modules/admin/admin.module";
import { DepositeCalculatorModule } from './modules/deposite-calculator/deposite-calculator.module';

@Module({
  imports: [UserModule, AdminModule, AccountModule, OperationModule, DepositeCalculatorModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
