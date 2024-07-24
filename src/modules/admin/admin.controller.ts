import { Body, Controller, Get, HttpCode, HttpException, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserBlockInput } from './models/user-block.input';
import { ADMIN_ACTIONS } from './admin-actions';
import { UserInfoDto } from '../user/models/user-info.dto';
import { UserInfoService } from '../user/user-info.service';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import { OperationService } from '../operation/operation.service';
import { Operation } from '../operation/operation.entity';
import { OperationInfoService } from '../operation/operation-info.service';
import { BalanceService } from '../account/balance.service';
import { TypeResult } from '../../models/results/type-result';
import { Result } from '../../models/results/result';
import { AccountBalanceDto } from '../account/models/account.balance.dto';
import { AccountInfo } from '../account/models/account-info.extended';
import { ChangeRateInput } from './models/change-rate.input';
import { AdminDepositService } from './admin-deposit.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiDefaultResultResponse } from '../../../api-docs/custom-decorators/result-api-response.decorator';
import * as adminControllerResponseExamples from '../../../api-docs/response-examples/admin-controller.json';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,
              private readonly userInfoService: UserInfoService,
              private readonly accountService: AccountService,
              private readonly operationService: OperationService,
              private readonly operationInfoService: OperationInfoService,
              private readonly balanceService: BalanceService,
              private readonly adminDepositService: AdminDepositService,
  ) {
  }

  
  @Post('block-user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Block user account and all bank accounts',
    description: 'unable if user is already block',
  })
  @ApiDefaultResultResponse()
  async blockUser(@Body() input: UserBlockInput) {
    return await this.adminService.userBlockAction(input, ADMIN_ACTIONS.BlockUser);
  }

  
  @Post('unblock-user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Unblock user account and all bank accounts',
    description: 'unable if user is not block',
  })
  @ApiDefaultResultResponse()
  async unblockUser(@Body() input: UserBlockInput) {
    return await this.adminService.userBlockAction(input, ADMIN_ACTIONS.UnblockUser);
  }

  
  @Get('user-info')
  @ApiOperation({ summary: 'Get user info and all accounts' })
  @ApiResponse({ 
    status: 200,
    description: 'returns an object with userInfo and accounts properties',
    schema: { example: adminControllerResponseExamples.userInfo }
  })
  async getUserInfo(@Query('userId') userId: string) {
    const userInfo: UserInfoDto = await this.userInfoService.getUserInfoById(userId);

    if (!userInfo)
      throw new HttpException('User not found', 404);

    const usersAccounts: AccountInfo[] = await this.accountService.getUsersAccount(userId);

    for (const account of usersAccounts) {
      const balanceResult: TypeResult<AccountBalanceDto> =
        await this.balanceService.getBalanceForAccount(account.id, userId, false);

      account.balance = balanceResult.data.balance;
    }

    return { userInfo, accounts: usersAccounts };
  }

  
  @Get('account-operations')
  @ApiOperation({ summary: 'Get account info and all operations' })
  @ApiResponse({ 
    status: 200,
    description: 'returns an object with account, balance and operations properties',
    schema: { example: adminControllerResponseExamples.accountOperations }
  })
  async getAccountOperations(@Query('accountId') accountId: string) {
    const account: Account = await this.accountService.getAccount(accountId);

    if (!account)
      throw new HttpException('Account not found', 404);

    const balanceResult: TypeResult<AccountBalanceDto> =
      await this.balanceService.getBalanceForAccount(accountId, undefined, false);

    if (!balanceResult.isSuccessful)
      throw new HttpException(balanceResult.message, balanceResult.statusCode);

    const balance: number = balanceResult.data.balance;

    const operations: Operation[] = await this.operationInfoService.getOperationsForAccount(accountId);

    return { account: account, balance: balance, operations: operations };
  }

  
  @Post('change-rate-for-deposit')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change rate for deposit account' })
  @ApiDefaultResultResponse()
  async changeRateForDeposit(@Body() input: ChangeRateInput) {
    this.adminDepositService.changeDepositRate(input.accountId, input.rate);

    return Result.success();
  }
}
