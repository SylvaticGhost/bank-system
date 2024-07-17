import {Body, Controller, HttpException, Post, UseGuards} from '@nestjs/common';
import {UserGuard} from "../guard/user.guard";
import {AccountCreateDto} from "./models/account.create.dto";
import {GetPayload} from "../decorators/getPayload.decorator";
import {UserPayloadDto} from "../user/models/user.payload.dto";
import {AccountService} from "./account.service";
import {Account} from "./account.entity";
import {TypeResult} from "../models/results/type-result";
import {AccountCloseDto} from "./models/account.close.dto";

@UseGuards(UserGuard)
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {
    }
    
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

}
