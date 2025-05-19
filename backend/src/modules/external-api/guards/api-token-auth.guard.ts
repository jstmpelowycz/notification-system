import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { ApiTokensService } from '@/modules/api-tokens/api-tokens.service';
import { EXTERNAL_API_ERROR_MESSAGES } from '@/modules/external-api/constants/error-messages';
import { createHash } from '@/modules/external-api/utils/create-hash';

@Injectable()
export class ApiTokenAuthGuard implements CanActivate {
    constructor(private readonly apiTokensService: ApiTokensService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException(EXTERNAL_API_ERROR_MESSAGES.MISSING_TOKEN);
        }

        const [type, plainTextToken] = authHeader.split(' ');

        if (type !== 'Bearer' || !plainTextToken) {
            throw new UnauthorizedException(EXTERNAL_API_ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
        }

        const [prefix, tokenPart] = plainTextToken.split('.');

        if (!prefix || !tokenPart) {
            throw new UnauthorizedException(EXTERNAL_API_ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
        }

        const apiToken = await this.apiTokensService.findByPrefix(prefix);

        if (!apiToken) {
            throw new UnauthorizedException(EXTERNAL_API_ERROR_MESSAGES.INVALID_TOKEN);
        }

        const fullToken = prefix + tokenPart;
        const hash = createHash(fullToken);

        if (hash !== apiToken.hash) {
            throw new UnauthorizedException(EXTERNAL_API_ERROR_MESSAGES.INVALID_TOKEN);
        }

        return true;
    }
}
