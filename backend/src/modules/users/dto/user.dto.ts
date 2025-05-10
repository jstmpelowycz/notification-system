import { User } from '@/modules/users/entities/user.entity';

export class UserResponseDto {
    user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}
