import {UserService} from "./user.service";
import {UserInfoDto} from "./models/user-info.dto";
import {User} from "./user.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserInfoService {
    constructor(private readonly userService: UserService) {}
    
    async getUserInfoById(userId: string) : Promise<UserInfoDto | null> {
        return await this.userService.getUserById(userId);
    }
    
    async getUserInfoByEmail(email: string) : Promise<UserInfoDto | null> {
        return await this.userService.getUserByEmail(email);
    }
}