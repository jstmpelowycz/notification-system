import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { COOKIE_KEYS } from '@/constants/cookie-keys';
import { JWT_RESPONSE_COOKIE_OPTIONS } from '@/modules/auth/constants/jwt-cookie-options';
import { CreateUserRequestDto, CreateUserResponseDto } from '@/modules/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LoginUserRequestDto, LoginUserResponseDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() requestDto: CreateUserRequestDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<CreateUserResponseDto> {
        const { accessToken, user } = await this.authService.register(requestDto);

        response.cookie(COOKIE_KEYS.JWT, accessToken, JWT_RESPONSE_COOKIE_OPTIONS);

        const responseDto = new CreateUserResponseDto();

        responseDto.user = user;

        return responseDto;
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() requestDto: LoginUserRequestDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<LoginUserResponseDto> {
        const user = await this.authService.validate(requestDto);

        const { accessToken } = this.authService.login(user);

        response.cookie(COOKIE_KEYS.JWT, accessToken, JWT_RESPONSE_COOKIE_OPTIONS);

        const responseDto = new LoginUserResponseDto();

        responseDto.user.id = user.id;
        responseDto.user.email = user.email;
        responseDto.user.firstName = user.firstName;
        responseDto.user.lastName = user.lastName;

        return responseDto;
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Res({ passthrough: true }) response: Response): void {
        response.clearCookie(COOKIE_KEYS.JWT);
    }
}
