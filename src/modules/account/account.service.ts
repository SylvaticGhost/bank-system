import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../data/prisma.service";
import {Account} from "./account.entity";
import {TypeResult} from "../../models/results/type-result";
import {Result} from "../../models/results/result";
import {AccountDto} from "./models/account.dto";
import {AccountType} from "../../buisness-info/account-types";

@Injectable()
export class AccountService {
    constructor(private readonly prismaService: PrismaService) {
        
    }
    
    async getAccount(accountId: string) : Promise<Account | null> {
        const dbRecord = await this.prismaService.account.findUnique({ 
            where: { id: accountId } 
        });
        
        if (!dbRecord) 
            return null;
        
        return new Account(dbRecord as AccountDto);
    }
    
    async getUsersAccount(userId: string) : Promise<Account[]> {
        const dbRecords = await this.prismaService.account.findMany({ 
            where: { ownerId: userId } 
        });
        
        return dbRecords.map(record => new Account(record));
    }
    
    async createAccount(createDto, userId, type: AccountType) : Promise<TypeResult<Account>> { 
        const newAccount = Account.create(createDto, userId, type);
        
        await this.prismaService.account.create({data: newAccount.getDto()});
        
        return TypeResult.success(newAccount, 201);
    }
    
    async closeAccount(accountId: string, issuerId: string, validateIssuer: boolean = true ) : Promise<Result> {
        const account : Account = await this.getAccount(accountId);
        
        if(!account)
            return Result.fail('Account not found', 404);
        
        if(validateIssuer && account.ownerId !== issuerId)
            return Result.fail('Account does not belong to issuer', 403);
        
        if(account.isClosed)
            return Result.fail('Account already closed', 400);
        
        await this.prismaService.account.update({
            where: { id: accountId },
            data: { isClosed: true }
        });
    }
    
    async reopenAccount(input: AccountActionInput) : Promise<Result> {
        const account : Account = await this.getAccount(input.accountId);
        
        if(!account)
            return Result.fail('Account not found', 404);
        
        if(!account.isClosed)
            return Result.fail('Account is not closed', 400);
        
        if(input.validateIssuer && account.ownerId !== input.issuerId)
            return Result.fail('Account does not belong to issuer', 403);
        
        await this.prismaService.account.update({
            where: { id: input.accountId },
            data: { isClosed: false }
        });
        
        return Result.success();
    }
}

export class AccountActionInput {
    readonly accountId: string;
    readonly issuerId?: string;
    readonly validateIssuer: boolean = true;
}