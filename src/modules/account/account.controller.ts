import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountCreateDto } from './models/account.create.dto';
import { UserPayloadDto } from '../user/models/user.payload.dto';
import { AccountActionInput, AccountService } from './account.service';
import { AccountCloseDto } from './models/account.close.dto';
import { BalanceService } from './balance.service';
import { UserGuard } from '../../guards/user.guard';
import { GetPayload } from '../../decorators/getPayload.decorator';
import { Currency, validateCurrency } from '../../buisness-info/currencies';
import { TypeResult } from '../../models/results/type-result';
import { AccountBalanceDto } from './models/account.balance.dto';
import { getExchangeRateLatest } from '../operation/exchange-rate';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as responseExamples from '../../../api-docs/response-examples/account-controller.json';
import { Account } from './account.entity';

@UseGuards(UserGuard)
@Controller('account')
@ApiTags('account')
@ApiBearerAuth('access-token')
export class AccountController {
  constructor(private readonly accountService: AccountService,
              private readonly balanceService: BalanceService) {
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new bank account for user' })
  @ApiResponse({
    status: 201,
    description: 'As data prop in response is returned an account object',
    schema: { example: responseExamples.accountCreateResponse },
  })
  async create(@Body() accountCreateDto: AccountCreateDto, @GetPayload() userPayload: UserPayloadDto) {
    return await this.accountService.createAccount(accountCreateDto, userPayload.id, 'CASH');
  }

  @Get('my-accounts')
  @ApiOperation({ summary: 'Get all accounts for current user' })
  @ApiResponse({
    status: 200,
    description: 'returns an array of accounts object with balance property added to each account object',
    schema: { example: responseExamples.getMyAccounts },
  })
  async getMyAccounts(@GetPayload() userPayload: UserPayloadDto) {
    const accounts: Account[] = await this.accountService.getUsersAccount(userPayload.id);

    const balances: AccountBalanceDto[] = await Promise.all(accounts.map(async account => {
      const result = await this.balanceService.getBalanceForAccount(account.id, userPayload.id);
      if (result.isSuccessful) {
        return result.data;
      }
      throw new Error('Failed to get balance');
    }));

    return accounts.map((account, index) => {
      return {
        ...account,
        balance: balances[index].balance,
      };
    });
  }


  @Post('close')
  @HttpCode(200)
  @ApiOperation({ summary: 'Close an account, after closing the account will not be available for operations' })
  @ApiResponse({
    status: 200,
    description: 'return empty response if account was closed successfully',
  })
  async close(@Body() accountCloseDto: AccountCloseDto, @GetPayload() userPayload: UserPayloadDto) {
    return await this.accountService.closeAccount(accountCloseDto.accountId, userPayload.id);
  }

  @Post('reopen')
  @HttpCode(200)
  @ApiOperation({ summary: 'Open an early closed account' })
  @ApiResponse({
    status: 200,
    description: 'return empty response if account was closed successfully',
  })
  async open(@Body() accountCloseDto: AccountCloseDto, @GetPayload() userPayload: UserPayloadDto) {
    const accountActionInput: AccountActionInput = {
      accountId: accountCloseDto.accountId,
      issuerId: userPayload.id,
      validateIssuer: true,
    };

    return await this.accountService.reopenAccount(accountActionInput);
  }

  @Get('my-balance')
  @ApiOperation({ summary: `get balance for a specific user's account` })
  @ApiResponse({
    status: 200,
    description: 'As data prop in response is returned an account balance object',
    schema: { example: responseExamples.getMyBalanceResponse },
  })
  async getMyBalance(@Query('accountId') accountId: string, @GetPayload() userPayload: UserPayloadDto) {
    return await this.balanceService.getBalanceForAccount(accountId, userPayload.id);
  }

  @Get('balance-converted')
  @ApiOperation({ summary: 'get balance for a specific account in a different currency' })
  @ApiResponse({
    status: 200,
    description: 'As data prop in response is returned an account balance object',
    schema: { example: responseExamples.getMyBalanceConverted },
  })
  async getBalanceConverted(@Query('accountId') accountId: string, @Query('currency') currency: Currency, @GetPayload() userPayload: UserPayloadDto) {
    if (!validateCurrency(currency))
      throw new BadRequestException('currency is not supported');

    const balanceResult: TypeResult<AccountBalanceDto> = await this.balanceService.getBalanceForAccount(accountId, userPayload.id);

    if (!balanceResult.isSuccessful)
      return balanceResult;

    if (balanceResult.data.currency === currency)
      return balanceResult;

    const exchangeRate: number = await getExchangeRateLatest(balanceResult.data.currency, currency);

    if (!exchangeRate)
      throw new InternalServerErrorException('Exchange rate not found');

    const convertedBalance: number = balanceResult.data.balance * exchangeRate;

    return TypeResult.success<AccountBalanceDto>({
      accountId: accountId,
      balance: convertedBalance,
      currency: currency,
    }, 200);
  }

}
