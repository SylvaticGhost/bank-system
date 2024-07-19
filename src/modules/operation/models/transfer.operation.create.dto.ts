import {IsString, IsUUID} from "class-validator";

export class TransferOperationCreateDto {
    @IsUUID()
    myAccountId: string;
    
    @IsUUID()
    targetAccountId: string;
    
    amount: number;
    
    @IsString()
    description: string;
}