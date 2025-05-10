import { IsEmail, IsString } from 'class-validator';

import { UserResponseDto } from '@/modules/users/dto/user.dto';

export class CreateUserRequestDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}

export class CreateUserResponseDto extends UserResponseDto {
    accessToken: string;
}
