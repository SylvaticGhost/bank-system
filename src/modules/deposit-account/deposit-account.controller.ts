import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserGuard } from '../../guards/user.guard';
import { DepositCreateInput } from './models/deposit-create.input';
import { UserPayloadDto } from '../user/models/user.payload.dto';
import { GetPayload } from '../../decorators/get-payload.decorator';
import { AccountService } from '../account/account.service';
import { ACCOUNT_TYPES } from '../../buisness-info/account-types';
import { TypeResult } from '../../models/results/type-result';
import { Account } from '../account/account.entity';
import { depositRate } from '../../buisness-info/deposit-rate';
import { DepositAccountService } from './deposit-account.service';
import { DepositInfo } from './deposit-info.entity';
import { CalculateIncomeInput } from './models/calculate-income.input';
import { OperationService } from '../operation/operation.service';
import { DepositCalculatorService } from '../deposit-calculator/deposit-calculator.service';
import { DepositCalculateInput } from '../deposit-calculator/models/deposit-calculate.input';
import { BalanceService } from '../account/balance.service';
import { AccountBalanceDto } from '../account/models/account.balance.dto';
import { DepositCalculateResult } from '../deposit-calculator/models/deposit-calculate.result';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as responseExamples from '../../../api-docs/response-examples/deposit-account-controller.json'

@Controller('deposit-account')
@UseGuards(UserGuard)
@ApiTags('deposit-account')
@ApiBearerAuth('access-token')
export class DepositAccountController {
  constructor(private readonly accountService: AccountService,
              private readonly operationService: OperationService,
              private readonly depositAccountService: DepositAccountService,
              private readonly balanceService: BalanceService,
              private readonly depositCalculatorService: DepositCalculatorService) {
  }

  
  @Post('create')
  @ApiOperation({ summary: 'Create bank account with deposit functionality' })
  @ApiResponse({
    status: 201,
    schema: { example: responseExamples.createDeposit }
  })
  async createDepositAccount(@Body() input: DepositCreateInput, @GetPayload() user: UserPayloadDto) {
    const rate : Number = depositRate[input.currency];

    if (!rate)
      throw new BadRequestException('currency is not supported');

    const accountCreateResult: TypeResult<Account> = await this.accountService.createAccount(input, user.id, ACCOUNT_TYPES.DEPOSIT);

    if (!accountCreateResult.isSuccessful)
      return accountCreateResult;

    const depositInfo: DepositInfo = {
      accountId: accountCreateResult.data.id,
      rate: Number(rate),
    };

    await this.depositAccountService.saveDepositInfo(depositInfo);

    await this.depositAccountService.createDepositOperation(
      { depositInfo, user, amount: input.depositAmount, currency: input.currency });

    return { account: accountCreateResult.data, depositInfo: depositInfo };
  }

  
  @Post('calculate-income')
  @HttpCode(200)
  @ApiOperation({ summary: 'Calculate future deposit income of this account' })
  @ApiResponse({ 
    status: 200,
    schema: { example: responseExamples.calculateIncome }
  })
  async calculateIncome(@Body() input: CalculateIncomeInput, @GetPayload() user: UserPayloadDto) {
    const account: Account = await this.accountService.getAccount(input.accountId);

    this.validateAccountForCalc(account, user);

    const depositInfo: DepositInfo = await this.depositAccountService.getDepositInfo(input.accountId);

    if (!depositInfo)
      throw new InternalServerErrorException('failed to find info about deposit');

    const dateOfLastOperation: Date | null = await this.operationService.getDateOfLastOperationOfAccount(input.accountId);

    if (!dateOfLastOperation)
      throw new InternalServerErrorException('failed to find last operation');

    const balanceGetResult: TypeResult<AccountBalanceDto> = await this.balanceService.getBalanceForAccount(input.accountId, undefined, false);
    console.info(balanceGetResult);
    if (!balanceGetResult.isSuccessful)
      throw new InternalServerErrorException('failed to get balance');

    const depositCalculatorInput: DepositCalculateInput = {
      currency: account.currency,
      amount: balanceGetResult.data.balance,
      years: input.years,
    };

    const depositCalculateResult: DepositCalculateResult = this.depositCalculatorService.calculateDeposit(depositCalculatorInput, depositInfo.rate);

    dateOfLastOperation.setFullYear(dateOfLastOperation.getFullYear() + input.years);
    const endDate: Date = new Date(dateOfLastOperation);
    
    return { date: endDate, ...depositCalculateResult };
  }

  
  private validateAccountForCalc(account: Account, user: UserPayloadDto) {
    if (!account)
      throw new BadRequestException('Account not found');

    if (account.ownerId !== user.id)
      throw new ForbiddenException('Account does not belong to issuer');

    if (account.isClosed)
      throw new BadRequestException('Account is closed');

    if (account.type !== ACCOUNT_TYPES.DEPOSIT)
      throw new BadRequestException('Account is not deposit');
  }
}
