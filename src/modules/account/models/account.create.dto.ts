import {IsString} from "class-validator";
import {IsCurrencyValid} from "../../../decorators/isCurrencyValid.decorator";

export class AccountCreateDto {
    @IsString()
    tag: string;
    @IsCurrencyValid()
    currency: string;
}