import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../data/prisma.service";
import {Operation} from "./operation.entity";
import {Transaction} from "./models/transaction";

import {getExchangeRateLatest} from "./exchange-rate";
import {Account} from "../account/account.entity";
import {Currency} from "../../buisness-info/currencies";

@Injectable()
export class OperationService {
    constructor(private readonly prismaService: PrismaService) {}
    
    async saveFromTransaction(transaction: Transaction, issuer: Account, partner: Account) {
        let amountForFirstAccount: number = -transaction.amount;
        let amountForSecondAccount: number;
        
        let secondCurrency: Currency;
        
        if(transaction.currency !== partner.currency) {
            const exchangeRate : Number = await getExchangeRateLatest(transaction.currency, partner.currency);
            
            amountForSecondAccount = transaction.amount * Number(exchangeRate);
            secondCurrency = partner.currency;
        }
        else {
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
            comment: transaction.comment
        };
        
        const operationForSecondAccount: Operation = {
            transactionId: transaction.transactionId,
            accountId: partner.id,
            partnerId: issuer.id,
            amount: amountForSecondAccount,
            currency: secondCurrency,
            time: transaction.time,
            type: transaction.type,
            comment: transaction.comment
        };

        await this.prismaService.operation.createMany({
            data: [operationForFirstAccount, operationForSecondAccount],
        });
    }
    
    async getOperationsForAccount(accountId: string) : Promise<Operation[]> {
        const operationsFromDb = await this.prismaService.operation.findMany({
            where: {
                accountId: accountId
            }
        });
        
        return operationsFromDb.map(operation => operation as Operation)
    }
    
    getOperation(transactionId: string, accountId: string) : Operation | null {
        const operation = this.prismaService.operation.findUnique({
            where: {
                transactionId_accountId: {
                    transactionId: transactionId,
                    accountId: accountId
                }
            }
        }) 
        
        if(!operation) {
            return null;
        }
        
        return operation as unknown as Operation;
    }
}
