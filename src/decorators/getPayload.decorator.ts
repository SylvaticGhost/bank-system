import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {UserPayloadDto} from "../user/models/user.payload.dto";


export const GetPayload =  createParamDecorator(
    (data: unknown, ctx: ExecutionContext) : UserPayloadDto => {
        const request = ctx.switchToHttp().getRequest();
      
        return {
            id: request.user.userId,
            email: request.user.email,
            firstName: request.user.firstName,
            lastName: request.user.lastName
        };
    }
);