import {Body, Controller, HttpException, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserCreateDto} from "./models/user.create.dto";
import {UserLoginDto} from "./models/user.login.dto";
import {AuthService} from "./auth/auth.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}
    
    @Post('register')
    async register(@Body() createDto: UserCreateDto) {
        console.info(createDto)
        const result = await this.authService.createUser(createDto);
        
        if(!result.isSuccessful)
            throw new HttpException(result.message, result.statusCode)
        
        return result;
    }
    
    @Post('login')
    async login(@Body() loginDto: UserLoginDto) { 
        const result = await this.authService.login(loginDto);
        return result;
    }
}
