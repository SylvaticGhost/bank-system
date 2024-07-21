import { Injectable } from '@nestjs/common';
import {DepositCalculateInput} from "./models/deposit-calculate.input";
import {depositRate} from "../../buisness-info/deposit-rate";
import {DepositCalculateResult} from "./models/deposit-calculate.result";

@Injectable()
export class DepositCalculatorService {
    calculateDeposit(input: DepositCalculateInput) : DepositCalculateResult { 
        const rate  = Number(depositRate[input.currency]);
        let sum = Number(input.amount);
        
        for (let i = 0; i < input.years; i++) {
            sum += sum * rate;
        }
        
        return {
            amount: input.amount,
            currency: input.currency,
            rate: rate,
            years: input.years,
            resultSum: sum,
            benefit: sum - input.amount
        }
    }
}
