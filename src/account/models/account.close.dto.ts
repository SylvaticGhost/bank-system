import {IsUUID} from "class-validator";

export class AccountCloseDto {
    @IsUUID()
    readonly accountId: string;
}