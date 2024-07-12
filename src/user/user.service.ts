import { Injectable } from '@nestjs/common';
import {PrismaService} from "../data/prisma.service";
import {UserCreateDto} from "./models/user.create.dto";
import {PasswordHasher} from "./auth/password-hasher";
import {User} from "./user.entity";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {
    }
    
    async createUser(createDto: UserCreateDto) {
        const hashedPassword = await PasswordHasher.hashPassword(createDto.password);
        
        const user = User.fromCreateDto(createDto, hashedPassword);
        
        await this.prismaService.user.create({
            data: user.getDto()
        });
    }
}
