import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {PrismaService} from "../data/prisma.service";
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [AuthModule],
  exports: [UserService],
  providers: [UserService, PrismaService]
})
export class UserModule {}
