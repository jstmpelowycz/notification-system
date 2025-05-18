import { UserResponseDto } from '@/modules/users/dto/user.dto';

export class FindUserResponseDto {
    user: UserResponseDto['user'] | null;
}
