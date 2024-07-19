import {OperationService} from "./operation.service";
import {AccountService} from "../account/account.service";
import {Account} from "@prisma/client";
import {Injectable} from "@nestjs/common";
import {UserInfoService} from "../user/user-info.service";

@Injectable()
export class OperationInfoService {
    constructor(private readonly operationService: OperationService,
                private readonly accountService: AccountService,
                private readonly userinfoService: UserInfoService) {}
    
    async getOperationsForAccount(accountId: string) { 
        const operations = await this.operationService.getOperationsForAccount(accountId);

        return await Promise.all(operations.map(async operation => {
            const partnerBankAccount: Account = await this.accountService.getAccount(operation.partnerId);

            const partner = await this.userinfoService.getUserInfoById(partnerBankAccount.ownerId);
            return {
                ...operation,
                partnerName: partner.firstName + ' ' + partner.lastName,
            };
        }));
    }
}