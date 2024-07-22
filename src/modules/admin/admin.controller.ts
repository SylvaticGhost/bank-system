import { Body, Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import {AdminService} from "./admin.service";
import {UserBlockInput} from "./models/user-block.input";
import {ADMIN_ACTIONS} from "./admin-actions";
import { UserInfoDto } from '../user/models/user-info.dto';
import { UserInfoService } from '../user/user-info.service';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import { OperationService } from '../operation/operation.service';
import { Operation } from '../operation/operation.entity';
import { OperationInfoService } from '../operation/operation-info.service';
import { BalanceService } from '../account/balance.service';
import { TypeResult } from '../../models/results/type-result';
import { AccountBalanceDto } from '../account/models/account.balance.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService, 
                private readonly userInfoService: UserInfoService,
                private readonly accountService: AccountService,
                private readonly operationService: OperationService,
                private readonly operationInfoService: OperationInfoService,
                private readonly balanceService: BalanceService
                ) {}
    
    @Post('block-user')
    async blockUser(@Body()input: UserBlockInput) {
        return await this.adminService.userBlockAction(input, ADMIN_ACTIONS.BlockUser);
    }

    @Post('unblock-user')
    async unblockUser(@Body()input: UserBlockInput) {
        return await this.adminService.userBlockAction(input, ADMIN_ACTIONS.UnblockUser);
    }
    
    @Get('user-info')
    async getUserInfo(@Query('userId') userId:string) {
        const userInfo : UserInfoDto = await this.userInfoService.getUserInfoById(userId);
        
        if(!userInfo)
            throw new HttpException('User not found', 404);
        
        const usersAccounts : Account[] = await this.accountService.getUsersAccount(userId);
        
        return { userInfo, accounts: usersAccounts };
    }
    
    @Get('account-operations')
    async getAccountOperations(@Query('accountId') accountId: string)  {
        const account : Account = await this.accountService.getAccount(accountId);
        
        if(!account)
            throw new HttpException('Account not found', 404);
        
        const balanceResult : TypeResult<AccountBalanceDto> =
          await this.balanceService.getBalanceForAccount(accountId, undefined, false);
        
        if (!balanceResult.isSuccessful)
            throw new HttpException(balanceResult.message, balanceResult.statusCode);
        
        const balance : number = balanceResult.data.balance;
        
        const operations : Operation[] = await this.operationInfoService.getOperationsForAccount(accountId);
        
        return { account: account, balance: balance, operations: operations };
    }
}
