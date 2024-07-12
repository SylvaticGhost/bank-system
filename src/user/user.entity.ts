import {UserDto} from "./models/user.dto";
import {UserCreateDto} from "./models/user.create.dto";
import { v4 as uuidv4 } from 'uuid';
import {HashedPassword} from "./models/hashed-password";

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    birthdate: Date;
    
    constructor(userDto: UserDto) {
        this.id = userDto.id;
        this.firstName = userDto.firstName;
        this.lastName = userDto.lastName;
        this.email = userDto.email;
        this.passwordHash = userDto.passwordHash;
        this.passwordSalt = userDto.passwordSalt;
        this.birthdate = userDto.birthdate;
    }
    
    static fromCreateDto(createDto: UserCreateDto, hashedPassword: HashedPassword): User { 
        return new User({
            id: uuidv4(),
            firstName: createDto.firstName,
            lastName: createDto.lastName,
            email: createDto.email,
            passwordHash: hashedPassword.hash,
            passwordSalt: hashedPassword.salt,
            birthdate: new Date(createDto.birthdate)
        });
    }
    
    getDto() : UserDto {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            passwordHash: this.passwordHash,
            passwordSalt: this.passwordSalt,
            birthdate: this.birthdate
        };
    }
}