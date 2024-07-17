import { Injectable } from '@nestjs/common';
import {UserCreateDto} from "../models/user.create.dto";
import {PasswordHasher} from "./password-hasher";
import {User} from "../user.entity";
import {PrismaService} from "../../data/prisma.service";
import {UserLoginDto} from "../models/user.login.dto";
import {TypeResult} from "../../models/results/type-result";
import {JwtToken} from "./jwt-token";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user.service";

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService, private readonly userService: UserService) {
    }
    
    async createUser(createDto: UserCreateDto) {
        const hashedPassword = await PasswordHasher.hashPassword(createDto.password);
        
        if(await this.userService.checkIfUserExists(createDto.email))
            return TypeResult.fail('User already exists', 400);

        const user = User.fromCreateDto(createDto, hashedPassword);

        await this.prismaService.user.create({
            data: user.getDto()
        });
        
        return TypeResult.success(user, 201);
    }

    async login(userLoginDto: UserLoginDto) : Promise<TypeResult<JwtToken>> {
        const userFromDb = await this.userService.getUserByEmail(userLoginDto.email);

        if(!userFromDb)
            return TypeResult.fail<JwtToken>('incorrect login or password', 400);

        const isPasswordValid =
            await PasswordHasher.comparePasswords(userLoginDto.password, userFromDb.getHashedPassword());

        if(!isPasswordValid)
            return TypeResult.fail<JwtToken>('incorrect login or password', 400);

        const token = await this.generateToken(userFromDb);

        return TypeResult.success<JwtToken>(token)
    }

    private async generateToken(user: User) : Promise<JwtToken> {
        const token = await this.jwtService.signAsync(user.getPayload());
        return new JwtToken(token)
    }
}
