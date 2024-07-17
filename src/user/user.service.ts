import { Injectable } from '@nestjs/common';
import {PrismaService} from "../data/prisma.service";
import {User} from "./user.entity";
import {UserDto} from "./models/user.dto";


@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {
    }
    
    async getUserByEmail(email: string) : Promise<User| null> { 
        const record = await this.prismaService.user.findUnique({ 
            where: { email: email }
        });
        
        if (!record) 
            return null;
        
        const user : UserDto = record;
        
        return new User(user);
    }
    
    async checkIfUserExists(email: string) : Promise<boolean> { 
        const record = await this.prismaService.user.findUnique({ 
            where: { email: email }
        });
        
        return record != null;
    }
    
}
