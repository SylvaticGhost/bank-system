import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../data/prisma.service";
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
        
        return new User(record as UserDto);
    }
    
    async getUserById(id: string) : Promise<User | null> { 
        const record = await this.prismaService.user.findUnique({ 
            where: { id: id }
        });
        
        if (!record) 
            return null;
        
        return new User(record as UserDto);
    }
    
    async checkIfUserExists(email: string) : Promise<boolean> { 
        const record = await this.prismaService.user.findUnique({ 
            where: { email: email }
        });
        
        return record != null;
    }
    
    async updatedUser(updatedUser: User) {
        await this.prismaService.user.update({
            where: { id: updatedUser.id },
            data: {
                email: updatedUser.email,
                passwordHash: updatedUser.passwordHash,
                passwordSalt: updatedUser.passwordSalt,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                blocked: updatedUser.blocked,
            }
        });
    }
    
}
