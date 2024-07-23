import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {PrismaService} from "../../data/prisma.service";
import {BalanceService} from "./balance.service";
import {OperationService} from "../operation/operation.service";
import { DepositAccountModule } from '../deposit-account/deposit-account.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService, PrismaService, BalanceService, OperationService],
  exports: [AccountService, BalanceService]
})
export class AccountModule {}
