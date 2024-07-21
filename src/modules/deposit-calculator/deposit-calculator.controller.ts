import {Body, Controller, Post} from '@nestjs/common';
import {DepositCalculateInput} from "./models/deposit-calculate.input";
import {DepositCalculatorService} from "./deposit-calculator.service";

@Controller('deposit-calculator')
export class DepositCalculatorController {
    constructor(private readonly depositCalculatorService: DepositCalculatorService) {}
    
    @Post('/')
    async calculateDeposit(@Body() input: DepositCalculateInput) {
        return this.depositCalculatorService.calculateDeposit(input);
    }
}
