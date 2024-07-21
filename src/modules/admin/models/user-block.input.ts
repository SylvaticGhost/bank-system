import {IsString, IsUUID} from "class-validator";

export class UserBlockInput {
    @IsUUID()
    readonly userId: string;
    
    @IsString()
    readonly comment: string;
}