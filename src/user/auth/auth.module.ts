import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {UserModule} from "../user.module";
import {PrismaService} from "../../data/prisma.service";
import {JwtStrategy} from "./jwt-strategy";
import {UserService} from "../user.service";

@Module({
  imports: [PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Use ConfigService to access the environment variable
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    })
  ],
  exports: [AuthService],
  providers: [AuthService, PrismaService, JwtStrategy, UserService]
})
export class AuthModule {}
