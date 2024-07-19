import { Module } from '@nestjs/common';
import { DepositAccountController } from './deposit-account.controller';
import { DepositAccountService } from './deposit-account.service';

@Module({
  controllers: [DepositAccountController],
  providers: [DepositAccountService]
})
export class DepositAccountModule {}
