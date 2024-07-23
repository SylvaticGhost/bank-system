import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../data/prisma.service';

@Injectable()
export class AdminDepositService {
  constructor(private readonly prismaService: PrismaService) {}
  
  changeDepositRate(accountId: string, rate: number) { 
    return this.prismaService.depositInfo.update({
      where: { accountId },
      data: { rate }
    });
  }
}