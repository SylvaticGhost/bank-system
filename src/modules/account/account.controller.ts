import {Body, Controller, Get, HttpException, Post, Query, UseGuards} from '@nestjs/common';
import {AccountCreateDto} from "./models/account.create.dto";
import {UserPayloadDto} from "../user/models/user.payload.dto";
import {AccountService} from "./account.service";
import {Account} from "./account.entity";
import {TypeResult} from "../../models/results/type-result";
import {AccountCloseDto} from "./models/account.close.dto";
import {BalanceService} from "./balance.service";
import {UserGuard} from "../../guards/user.guard";
import {GetPayload} from "../../decorators/getPayload.decorator";

@UseGuards(UserGuard)
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService, 
                private readonly balanceService: BalanceService) {}
    
    @Post('create') 
    async create(@Body() accountCreateDto: AccountCreateDto, @GetPayload() userPayload: UserPayloadDto) {  
        const result : TypeResult<Account> =
            await this.accountService.createAccount(accountCreateDto, userPayload.id, 'CASH');
        
        if(!result.isSuccessful)
            throw new HttpException(result.message, result.statusCode);
        
        return result.data;
    }
    
    
    @Post('close')
    async close(@Body() accountCloseDto: AccountCloseDto, @GetPayload() userPayload: UserPayloadDto) {
        const result = await this.accountService.closeAccount(accountCloseDto.accountId, userPayload.id);
        
        if(!result.isSuccessful)
            throw new HttpException(result.message, result.statusCode);
        
        return result;
    }
    
    @Get('myBalance')
    async getMyBalance(@Query('accountId') accountId: string,@GetPayload() userPayload: UserPayloadDto) {
        const result = await this.balanceService.getBalanceForAccount(accountId, userPayload.id);
        
        if(!result.isSuccessful)
            throw new HttpException(result.message, result.statusCode);
        
        return result.data;
    }

}
