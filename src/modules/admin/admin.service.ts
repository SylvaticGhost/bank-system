import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../data/prisma.service';
import { UserBlockInput } from './models/user-block.input';
import { ADMIN_ACTIONS, AdminAction } from './admin-actions';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { Result } from '../../models/results/result';
import { uuid } from 'uuidv4';
import { BlockedUser } from './action-logs/blocked-user';
import { AccountService } from '../account/account.service';
import { BlockedAccount } from './action-logs/blocked-account';
import { TypeResult } from '../../models/results/type-result';
import { Account } from '../account/account.entity';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService,
              private readonly userService: UserService,
              private readonly accountService: AccountService,
  ) {}

  async userBlockAction(input: UserBlockInput, action: AdminAction): Promise<Result> {
    const user: User = await this.userService.getUserById(input.userId);

    if (!user) {
      return Result.fail('User not found', 404);
    }

    const actionId = uuid();

    if (action === 'BlockUser') {
      if (user.blocked)
        return Result.fail('User is already blocked', 400);

      await this.blockUserAccounts(input, actionId);
    } else {
      if (!user.blocked)
        return Result.fail('User is not blocked', 400);

      const resultOfGetActionId: TypeResult<string> = await this.getActionIdOfBlock(input.userId);

      if (!resultOfGetActionId.isSuccessful)
        return Result.fail(resultOfGetActionId.message, resultOfGetActionId.statusCode);

      await this.unblockUserAccounts(input, resultOfGetActionId.data, actionId);
    }

    await this.prismaService.user.update({
      where: { id: input.userId },
      data: { blocked: action === 'BlockUser' },
    });

    const blockedUserEntity: BlockedUser = {
      actionId: actionId,
      userId: user.id,
      comment: input.comment,
      time: new Date(),
      committedBy: 'Admin',
      action: action,
    };
    
    console.info('blockedUserEntity', blockedUserEntity);

    await this.prismaService.blockedUser.create({ data: blockedUserEntity });

    return Result.success();
  }


  private async blockUserAccounts(userBlockInput: UserBlockInput, blockActionId: string) {
    const accounts : Account[] = await this.accountService.getUsersAccount(userBlockInput.userId);

    for (const account of accounts) {
      await this.accountService.closeAccount(account.id, undefined, false);

      const blockedAccountEntity: BlockedAccount = {
        actionId: blockActionId,
        accountId: account.id,
        accountOwnerId: userBlockInput.userId,
        comment: userBlockInput.comment,
        time: new Date(),
        committedBy: 'Admin',
        action: ADMIN_ACTIONS.BlockUser,
      };

      await this.prismaService.blockedAccount.create({ data: blockedAccountEntity });
    }
  }


  private async unblockUserAccounts(input: UserBlockInput, actionOfBlockId: string, actionId: string) {
    const blockedAccounts = await this.prismaService.blockedAccount.findMany({
      where: {
        actionId: actionOfBlockId,
        accountOwnerId: input.userId,
      },
    });
    
    if (blockedAccounts.length === 0)
      return;
    
    const accountIds : string[] = blockedAccounts.map((account) => account.accountId);
    
    for (const accountId of accountIds) { 
      await this.accountService.reopenAccount({ accountId: accountId, validateIssuer: false});
      
      const blockedAccountEntity: BlockedAccount = {
        actionId: actionId,
        accountId: accountId,
        accountOwnerId: input.userId,
        comment: input.comment,
        time: new Date(),
        committedBy: 'Admin',
        action: 'UnblockUser',
      };
      
      await this.prismaService.blockedAccount.create({ data: blockedAccountEntity });
    }
  }

  private async getActionIdOfBlock(userId: string): Promise<TypeResult<string>> {

    const result = await this.prismaService.$queryRaw<BlockedUserAction>
      `SELECT action_id, action
       FROM admin_schema.blocked_users
       WHERE user_id = ${userId}::uuid
       ORDER BY time DESC
       LIMIT 1`;

    const actionOfBlockId: string = result[0]?.action_id;
    const action = result[0]?.action;
    
    if (!actionOfBlockId || !action)
      return TypeResult.fail<string>('failed to find data about blocking', 500);

    if (action !== 'BlockUser')
      return TypeResult.fail<string>('Data conflict of state of user', 500);

    return TypeResult.success(actionOfBlockId);
  }

}

interface BlockedUserAction {
  action_id: string;
  action: string;
}


