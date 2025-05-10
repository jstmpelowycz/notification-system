import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CONFIG_KEYS } from '@/constants/config-keys';
import { getJwtCookieFromRequest } from '@/modules/auth/utils/get-jwt-cookie-from-request';

interface Payload {
    sub: string;
    email: string;
}

interface Result {
    id: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([getJwtCookieFromRequest]),
            secretOrKey: configService.get<string>(CONFIG_KEYS.JWT_SECRET)!,
            ignoreExpiration: false,
        });
    }

    validate(payload: Payload): Result {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
