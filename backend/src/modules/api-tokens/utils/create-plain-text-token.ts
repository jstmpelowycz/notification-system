export const createPlainTextToken = (prefix: string, token: string): string => {
    return `${prefix}.${token.substring(8)}`;
};
