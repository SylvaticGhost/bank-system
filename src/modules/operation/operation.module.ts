import { Module } from '@nestjs/common';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';
import {AccountService} from "../account/account.service";
import {PrismaService} from "../../data/prisma.service";
import {UserModule} from "../user/user.module";
import {BalanceService} from "../account/balance.service";
import {OperationInfoService} from "./operation-info.service";

@Module({
  controllers: [OperationController],
  imports: [UserModule],
  exports: [OperationService, OperationInfoService],
  providers: [OperationService, AccountService, PrismaService, BalanceService, OperationInfoService]
})
export class OperationModule {}
