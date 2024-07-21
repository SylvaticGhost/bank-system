import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../data/prisma.service";
import {UserBlockInput} from "./models/user-block.input";
import { AdminAction } from "./admin-actions";
import {UserService} from "../user/user.service";
import {User} from "@prisma/client";
import {Result} from "../../models/results/result";
import {uuid} from "uuidv4";
import {BlockedUser} from "./blocked-user.entity";

@Injectable()
export class AdminService {
    constructor(private readonly prismaService: PrismaService,
                private readonly userService: UserService) {}
    
    async userBlockAction(input: UserBlockInput, action: AdminAction) : Promise<Result> {
        const user : User = await this.userService.getUserById(input.userId);
        
        if(!user) {
            return Result.fail('User not found', 404);
        }
        
        if(action === 'BlockUser') {
            if(user.blocked) {
                return Result.fail('User is already blocked', 400);
            }
            
        } else {
            if(!user.blocked) {
                return Result.fail('User is not blocked', 400);
            }
        }
        
        await this.prismaService.user.update({
                    where: {id: input.userId},
                    data: {blocked: action === 'BlockUser'}
                });
        
        const blockedUserEntity : BlockedUser = {
            actionId: uuid(),
            userId: user.id,
            comment: input.comment,
            blockedAt: new Date(),
            blockedBy: 'Admin',
            action: action
        }
        
        await this.prismaService.blockedUser.create({data: blockedUserEntity});
        
        return Result.success();
    } 
    
}
