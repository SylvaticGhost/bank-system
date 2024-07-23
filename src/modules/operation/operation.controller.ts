import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    NotFoundException,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {UserGuard} from "../../guards/user.guard";
import {TransferOperationCreateDto} from "./models/transfer.operation.create.dto";
import {UserPayloadDto} from "../user/models/user.payload.dto";
import {GetPayload} from "../../decorators/getPayload.decorator";
import {v4 as uuidv4} from 'uuid';
import {AccountService} from "../account/account.service";
import {OperationService} from "./operation.service";

import {Transaction} from "./models/transaction";
import {Account} from "../account/account.entity";
import {BalanceService} from "../account/balance.service";
import {OperationInfoService} from "./operation-info.service";
import { TopUpOperationCreateDto } from './models/top-up-operation.create.dto';
import { TopUpOperation } from './models/top-up-operation';
import { getExchangeRateLatest } from './exchange-rate';

@UseGuards(UserGuard)
@Controller('operation')
export class OperationController {
    constructor(private readonly operationService: OperationService, 
                private readonly accountService: AccountService,
                private readonly balanceService: BalanceService,
                private readonly operationInfoService: OperationInfoService) {}
    
    @Post('transfer')
    async transfer(@Body() input: TransferOperationCreateDto,
                   @GetPayload() user: UserPayloadDto){ 
        
        const account: Account = await this.accountService.getAccount(input.myAccountId);
        
        if(!account)
            throw new HttpException('Account not found', 404);
        
        if(account.ownerId !== user.id)
            throw new HttpException('Account does not belong to user', 403);
        
        if (account.isClosed)
            throw new HttpException('Account is closed', 400);
        
        const userBalanceResult = await this.balanceService.getBalanceForAccount(account.id, user.id);
        
        if(!userBalanceResult.isSuccessful)
            throw new HttpException('Error getting balance', userBalanceResult.statusCode);
        
        if(userBalanceResult.data.balance < input.amount)
            throw new HttpException('Insufficient funds', 400);
        
        const secondAccount: Account = await this.accountService.getAccount(input.targetAccountId);
        
        if(!secondAccount)
            throw new HttpException('Target account not found', 404);
        
        if (secondAccount.isClosed)
            throw new HttpException('Target account is closed', 400);
        
        const transactionId : string = uuidv4();
        
        const transaction: Transaction = {
            transactionId: transactionId,
            accountId: account.id,
            partnerId: secondAccount.id,
            amount: input.amount,
            currency: account.currency,
            time: new Date(),
            type: 'TRANSFER',
            comment: input.description
        };
        
        await this.operationService.saveFromTransaction(transaction, account, secondAccount);
        
        return transaction;
    }
    
    @Post('top-up-account')
    async topUpAccount(@Body() input: TopUpOperationCreateDto, @GetPayload() user: UserPayloadDto) {
        const transactionId : string = uuidv4();
        
        const account: Account = await this.accountService.getAccount(input.accountId);
        
        if(!account)
            throw new NotFoundException('Account not found');
        
        if (account.isClosed)
            throw new BadRequestException('Account is closed');
        
        if(input.amount === 0)
            throw new BadRequestException('Amount cannot be zero');
        
        let amount = input.amount;
        if (input.currency !== account.currency) {
            const rate = await getExchangeRateLatest(input.currency, account.currency);
            amount *= rate;
        }
        
        const topUpOperation: TopUpOperation = {
            transactionId: transactionId,
            accountId: account.id,
            time: new Date(),
            currency: account.currency,
            amount: amount
        }
        
        await this.operationService.saveFromTopUpOperation(topUpOperation);
        
        return topUpOperation;
    }
    
    @Get('operations')
    async getOperations(@GetPayload() user: UserPayloadDto, @Query('accountId') accountId: string) {
        const account: Account = await this.accountService.getAccount(accountId);
        
        if(!account)
            throw new HttpException('Account not found', 404);
        
        if(account.ownerId !== user.id)
            throw new HttpException('Account does not belong to user', 403);

        return await this.operationInfoService.getOperationsForAccount(accountId);
    }
}
