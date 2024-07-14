import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import {PrismaService} from "./data/prisma.service";
import { AccountModule } from './account/account.module';
import { OperationModule } from './operation/operation.module';

@Module({
  imports: [UserModule, AdminModule, AccountModule, OperationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
