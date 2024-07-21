import {Controller, Post} from '@nestjs/common';
import {AdminService} from "./admin.service";
import {UserBlockInput} from "./models/user-block.input";
import {ADMIN_ACTIONS} from "./admin-actions";

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}
    
    @Post('block-user')
    async blockUser(input: UserBlockInput) {
        return await this.adminService.userBlockAction(input, ADMIN_ACTIONS.BlockUser);
    }

    @Post('unblock-user')
    async unblockUser(input: UserBlockInput) {
        return await this.adminService.userBlockAction(input, ADMIN_ACTIONS.UnblockUserx);
    }
}
