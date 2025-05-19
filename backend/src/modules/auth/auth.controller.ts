import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import { COOKIE_KEYS } from '@/constants/cookie-keys';
import { CreateUserRequestDto, CreateUserResponseDto } from '@/modules/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { JWT_RESPONSE_COOKIE_OPTIONS } from './constants/jwt-cookie-options';
import { LoginUserRequestDto, LoginUserResponseDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
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

        responseDto.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        return responseDto;
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Res({ passthrough: true }) response: Response): void {
        response.clearCookie(COOKIE_KEYS.JWT);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    me(@Req() req: Request) {
        return { user: req.user };
    }
}
