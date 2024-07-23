import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../data/prisma.service';

import { UserPayloadDto } from '../user/models/user.payload.dto';
import { v4 as uuidv4 } from 'uuid';
import { Operation } from '../operation/operation.entity';
import { DepositInfo } from './deposit-info.entity';
import { Currency } from '../../buisness-info/currencies';
import { OPERATION_TYPES } from '../../buisness-info/operation-types';
import { OperationService } from '../operation/operation.service';


@Injectable()
export class DepositAccountService {
  constructor(private readonly prismaService: PrismaService,
              private readonly operationService: OperationService) {}
  
  async saveDepositInfo(depositInfo: DepositInfo) {
    await this.prismaService.depositInfo.create({ data: depositInfo });
  }
  
  async getDepositInfo(accountId: string): Promise<DepositInfo | null> { 
    return this.prismaService.depositInfo.findUnique({ where: { accountId } });
  }
  
  async createDepositOperation(input: CreateDepositOperationInput) {
    const transactionId = uuidv4();
    
    const operation: Operation = {
      transactionId: transactionId,
      accountId: input.depositInfo.accountId,
      partnerId: input.depositInfo.accountId,
      amount: input.amount,
      currency: input.currency,
      time: new Date(),
      type: OPERATION_TYPES.DEPOSIT,
      comment: 'Start deposit'
    };
    
    await this.operationService.saveOperation(operation);
  }
}

export type CreateDepositOperationInput = {
  depositInfo: DepositInfo;
  user: UserPayloadDto;
  amount: number;
  currency: Currency;
}
