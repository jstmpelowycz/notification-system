import { User } from '@/entities/user';

export class UserResponseDto {
    user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}
