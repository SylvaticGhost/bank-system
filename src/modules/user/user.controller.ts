import { Body, Controller, HttpCode, HttpException, Post } from '@nestjs/common';
import {UserService} from "./user.service";
import {UserCreateDto} from "./models/user.create.dto";
import {UserLoginDto} from "./models/user.login.dto";
import {AuthService} from "./auth/auth.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}
    
    @Post('register')
    async register(@Body() createDto: UserCreateDto) {
        return await this.authService.createUser(createDto);
    }
    
    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: UserLoginDto) { 
        return await this.authService.login(loginDto);
    }
}
