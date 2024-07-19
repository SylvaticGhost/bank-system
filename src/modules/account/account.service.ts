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
    
    async createAccount(createDto, userId, type: AccountType) { 
        const newAccount = Account.create(createDto, userId, type);
        
        await this.prismaService.account.create({data: newAccount.getDto()});
        
        return TypeResult.success(newAccount);
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
}
