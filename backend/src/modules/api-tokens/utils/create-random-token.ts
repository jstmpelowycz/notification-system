import { createHash, randomBytes } from 'crypto';

interface Result {
    prefix: string;
    token: string;
    hash: string;
}

export const createRandomToken = (): Result => {
    const token = randomBytes(32).toString('hex');
    const prefix = token.substring(0, 8);
    const hash = createHash('sha256').update(token).digest('hex');

    return {
        prefix,
        token,
        hash,
    };
};
