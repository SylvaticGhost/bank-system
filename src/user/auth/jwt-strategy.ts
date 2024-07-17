import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayloadDto } from '../models/user.payload.dto';
import { PassportStrategy } from '@nestjs/passport';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: UserPayloadDto) {
        return { userId: payload.id, email: payload.email, firstName: payload.firstName, lastName: payload.lastName };
    }
}