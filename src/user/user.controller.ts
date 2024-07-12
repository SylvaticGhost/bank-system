import {Body, Controller, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserCreateDto} from "./models/user.create.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post('register')
    async register(@Body() createDto: UserCreateDto) {
        console.info(createDto)
        return await this.userService.createUser(createDto);
    }
}
