import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UserResponseDto } from '@/modules/users/dto/user.dto';

export class LoginUserRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class LoginUserResponseDto extends UserResponseDto {}
