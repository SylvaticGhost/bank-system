import {OperationService} from "../operation/operation.service";
import {AccountService} from "./account.service";
import {TypeResult} from "../models/results/type-result";
import {AccountBalanceDto} from "./models/account.balance.dto";
import {Account} from "./account.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BalanceService {
    constructor(private readonly operationService: OperationService,
                        private readonly accountService: AccountService) {}
    
    async getBalanceForAccount(accountId: string, issuerUserId: string = undefined, validateIssuerId: boolean = true) 
        : Promise<TypeResult<AccountBalanceDto>> { 
        const account : Account | null = await this.accountService.getAccount(accountId);
        
        if(!account)
            return TypeResult.fail<AccountBalanceDto>('Account not found', 404);
        
        if(validateIssuerId && account.ownerId !== issuerUserId)
            return TypeResult.fail<AccountBalanceDto>('Account does not belong to issuer', 403);
        
        const operations = await this.operationService.getOperationsForAccount(accountId);
        
        let balance = 0;
        
        operations.forEach(operation => {
            balance += operation.amount;
        });
        
        return TypeResult.success<AccountBalanceDto>({accountId: accountId, balance: balance}, 200);
    }
}