import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {AccountCreateDto} from "./models/account.create.dto";
import {UserPayloadDto} from "../user/models/user.payload.dto";
import {AccountService} from "./account.service";
import {AccountCloseDto} from "./models/account.close.dto";
import {BalanceService} from "./balance.service";
import {UserGuard} from "../../guards/user.guard";
import {GetPayload} from "../../decorators/getPayload.decorator";
import { Currency, validateCurrency } from '../../buisness-info/currencies';
import { TypeResult } from '../../models/results/type-result';
import { AccountBalanceDto } from './models/account.balance.dto';
import { getExchangeRateLatest } from '../operation/exchange-rate';

@UseGuards(UserGuard)
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService, 
                private readonly balanceService: BalanceService) {}
    
    @Post('create') 
    async create(@Body() accountCreateDto: AccountCreateDto, @GetPayload() userPayload: UserPayloadDto) {  
        return await this.accountService.createAccount(accountCreateDto, userPayload.id, 'CASH');
    }
    
    
    @Post('close')
    async close(@Body() accountCloseDto: AccountCloseDto, @GetPayload() userPayload: UserPayloadDto) {
        return await this.accountService.closeAccount(accountCloseDto.accountId, userPayload.id);
    }
    
    @Get('my-balance')
    async getMyBalance(@Query('accountId') accountId: string,@GetPayload() userPayload: UserPayloadDto) {
        return await this.balanceService.getBalanceForAccount(accountId, userPayload.id);
    }
    
    @Get('balance-converted')
    async getBalanceConverted(@Query('accountId') accountId: string, @Query('currency') currency: Currency, @GetPayload() userPayload: UserPayloadDto) {
        if (!validateCurrency(currency)) 
            throw new BadRequestException('currency is not supported');
        
        const balanceResult : TypeResult<AccountBalanceDto> = await this.balanceService.getBalanceForAccount(accountId, userPayload.id);
        
        if (!balanceResult.isSuccessful)
            return balanceResult;
        
        if (balanceResult.data.currency === currency)
            return balanceResult;
        
        const exchangeRate : number = await getExchangeRateLatest(balanceResult.data.currency, currency);
        
        if (!exchangeRate)
            throw new InternalServerErrorException('Exchange rate not found');
        
        const convertedBalance : number = balanceResult.data.balance * exchangeRate;
        
        return TypeResult.success<AccountBalanceDto>({accountId: accountId, balance: convertedBalance, currency: currency}, 200);
    }

}
