import { CookieOptions } from 'express';

export const JWT_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2629746000, // 1 month
};
