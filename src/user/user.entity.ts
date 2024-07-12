import {UserDto} from "./models/user.dto";

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
}