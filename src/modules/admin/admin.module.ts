import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../data/prisma.service';
import { UserModule } from '../user/user.module';
import { OperationModule } from '../operation/operation.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [UserModule, OperationModule, AccountModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService]
})
export class AdminModule {}
