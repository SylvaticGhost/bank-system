import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {DepositCalculateInput} from "./models/deposit-calculate.input";
import {DepositCalculatorService} from "./deposit-calculator.service";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('deposit-calculator')
@ApiTags('deposit-calculator')
export class DepositCalculatorController {
    constructor(private readonly depositCalculatorService: DepositCalculatorService) {}
    
    @Post('/')
    @HttpCode(200)
    @ApiOperation({summary: 'Calculate deposit'})
    @ApiResponse({
        status: 200,
        schema: { 
            example: {
                "amount": 10000,
                "currency": "USD",
                "rate": 0.05,
                "years": 3,
                "resultSum": 11576.25,
                "benefit": 1576.25
            }
        }
    })
    async calculateDeposit(@Body() input: DepositCalculateInput) {
        return this.depositCalculatorService.calculateDeposit(input);
    }
}
