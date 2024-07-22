import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {PrismaService} from "../../data/prisma.service";
import { AuthModule } from './auth/auth.module';
import {UserInfoService} from "./user-info.service";

@Module({
  controllers: [UserController],
  imports: [AuthModule],
  exports: [UserInfoService, UserService],
  providers: [UserService, PrismaService, UserInfoService]
})
export class UserModule {}
