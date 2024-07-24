import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {UserService} from "./user.service";
import {UserCreateDto} from "./models/user.create.dto";
import {UserLoginDto} from "./models/user.login.dto";
import {AuthService} from "./auth/auth.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as responseExamples from '../../../api-docs/response-examples/user-controller.json'

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}
    
    @Post('register')
    @ApiOperation({summary: 'Register a new user'})
    @ApiBody({type: UserCreateDto})
    @ApiResponse({status: 201, schema: {example: responseExamples.register}})
    async register(@Body() createDto: UserCreateDto) {
        return await this.authService.createUser(createDto);
    }
    
    @Post('login')
    @HttpCode(200)
    @ApiBody({type: UserLoginDto})
    @ApiResponse({status: 200, schema: {example: responseExamples.login}})
    async login(@Body() loginDto: UserLoginDto) { 
        return await this.authService.login(loginDto);
    }
}
