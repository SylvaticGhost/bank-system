import {
  CanActivate,
  ExecutionContext,
  ForbiddenException, Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../data/prisma.service';
import { UserDto } from '../modules/user/models/user.dto';

@Injectable()
export class UserGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId)
      throw new UnauthorizedException();

    const userDb: UserDto = await this.prismaService.user.findUnique({ where: { id: user.userId } }) as UserDto;

    if (!userDb || userDb.blocked == null)
      throw new InternalServerErrorException('User not found');

    if (userDb.blocked)
      throw new ForbiddenException('User is blocked');

    return true;
  }
}