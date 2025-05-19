import * as crypto from 'crypto';

export const createHash = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};
