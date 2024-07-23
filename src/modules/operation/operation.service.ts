import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../data/prisma.service';
import { Operation } from './operation.entity';
import { Transaction } from './models/transaction';
import { getExchangeRateLatest } from './exchange-rate';
import { Account } from '../account/account.entity';
import { Currency } from '../../buisness-info/currencies';
import { TopUpOperation } from './models/top-up-operation';
import { OPERATION_TYPES } from '../../buisness-info/operation-types';
import { Prisma } from '@prisma/client';

@Injectable()
export class OperationService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async saveFromTransaction(transaction: Transaction, issuer: Account, partner: Account) {
    let amountForFirstAccount: number = -transaction.amount;
    let amountForSecondAccount: number;

    let secondCurrency: Currency;

    if (transaction.currency !== partner.currency) {
      const exchangeRate: Number = await getExchangeRateLatest(transaction.currency, partner.currency);

      amountForSecondAccount = transaction.amount * Number(exchangeRate);
      secondCurrency = partner.currency;
    } else {
      amountForSecondAccount = transaction.amount;
      secondCurrency = transaction.currency;
    }

    const operationForFirstAccount: Operation = {
      transactionId: transaction.transactionId,
      accountId: issuer.id,
      partnerId: partner.id,
      amount: amountForFirstAccount,
      currency: transaction.currency,
      time: transaction.time,
      type: transaction.type,
      comment: transaction.comment,
    };

    const operationForSecondAccount: Operation = {
      transactionId: transaction.transactionId,
      accountId: partner.id,
      partnerId: issuer.id,
      amount: amountForSecondAccount,
      currency: secondCurrency,
      time: transaction.time,
      type: transaction.type,
      comment: transaction.comment,
    };

    await this.prismaService.operation.createMany({
      data: [operationForFirstAccount, operationForSecondAccount],
    });
  }

  async saveFromTopUpOperation(topUpOperation: TopUpOperation) {
    const operation: Operation = {
      transactionId: topUpOperation.transactionId,
      accountId: topUpOperation.accountId,
      partnerId: topUpOperation.accountId,
      amount: topUpOperation.amount,
      currency: topUpOperation.currency,
      time: topUpOperation.time,
      type: OPERATION_TYPES.TOP_UP,
      comment: 'top up account',
    };

    await this.saveOperation(operation);
  }

  async saveOperation(operation: Operation) {
    await this.prismaService.operation.create({
      data: operation,
    });
  }


  async getOperationsForAccount(accountId: string): Promise<Operation[]> {
    const operationsFromDb = await this.prismaService.operation.findMany({
      where: {
        accountId: accountId,
      },
    });

    return operationsFromDb.map(operation => operation as Operation);
  }

  getOperation(transactionId: string, accountId: string): Operation | null {
    const operation = this.prismaService.operation.findUnique({
      where: {
        transactionId_accountId: {
          transactionId: transactionId,
          accountId: accountId,
        },
      },
    });

    if (!operation) {
      return null;
    }

    return operation as unknown as Operation;
  }

  async getDateOfLastOperationOfAccount(accountId: string): Promise<Date | null> {
    const result = await this.prismaService.$queryRaw<{ time: Date }[]>(Prisma.sql`SELECT time
                                                                                   FROM account_schema.operations
                                                                                   WHERE account_id = ${accountId}::uuid
                                                                                   ORDER BY time DESC
                                                                                   LIMIT 1;`);
    return result.length > 0 ? result[0].time : null;
}
}
