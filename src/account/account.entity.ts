import {AccountDto} from "./models/account.dto";
import {AccountCreateDto} from "./models/account.create.dto";
import { v4 as uuidv4 } from 'uuid';
import {Currency} from "./currencies";
import {AccountType} from "./accountTypes";

export class Account {
    readonly id: string;
    readonly ownerId: string;
    readonly tag: string;
    readonly currency: Currency;
    readonly type: AccountType;
    readonly createdAt: Date;
    isClosed: boolean = false;
    
    constructor(accountDto: AccountDto) {
        this.id = accountDto.id;
        this.ownerId = accountDto.ownerId;
        this.tag = accountDto.tag;
        this.currency = accountDto.currency;
        this.type = accountDto.type;
        this.createdAt = accountDto.createdAt;
        this.isClosed = accountDto.isClosed;
    }
    
    static create(createDto: AccountCreateDto, userId: string, type: AccountType) : Account {
        return new Account({ 
            id: uuidv4(),
            ownerId: userId,
            tag: createDto.tag,
            currency: createDto.currency,
            type: type,
            createdAt: new Date(),
            isClosed: false
        });
    }
    
    getDto() : AccountDto{
        return {
            id: this.id,
            ownerId: this.ownerId,
            tag: this.tag,
            currency: this.currency,
            type: this.type,
            createdAt: this.createdAt,
            isClosed: this.isClosed
        };
    }
    
    close() {
        this.isClosed = true;
    }
}
