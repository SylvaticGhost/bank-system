import {UserService} from "./user.service";
import {UserInfoDto} from "./models/user-info.dto";
import {Injectable} from "@nestjs/common";
import { User } from './user.entity';

@Injectable()
export class UserInfoService {
    constructor(private readonly userService: UserService) {}
    
    async getUserInfoById(userId: string) : Promise<UserInfoDto | null> {
        return await this.getUser(this.userService.getUserById(userId));
    }
    
    async getUserInfoByEmail(email: string) : Promise<UserInfoDto | null> {
        return await this.getUser(this.userService.getUserByEmail(email));
    }
    
    private async getUser(func: Promise<User| null>) : Promise<UserInfoDto | null> {
        const user : User | null = await func;
        
        if(!user)
            return null;
        
        return user.getInfoDto();
    }
}