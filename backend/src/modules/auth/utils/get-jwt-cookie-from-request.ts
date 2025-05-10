import { Request } from 'express';

export const getJwtCookieFromRequest = (request: Request): string | null => {
    if (request?.cookies?.jwt && typeof request.cookies.jwt === 'string') {
        return request.cookies.jwt;
    }

    return null;
};
