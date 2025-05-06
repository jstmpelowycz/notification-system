import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { COOKIE_KEYS } from '@/constants/cookie-keys';
import { JWT_COOKIE_OPTIONS } from '@/modules/auth/constants/jwt-cookie-options';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);

        const { accessToken } = this.authService.login(user);

        res.cookie(COOKIE_KEYS.JWT, accessToken, JWT_COOKIE_OPTIONS);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, user } = await this.authService.register(createUserDto);

        res.cookie(COOKIE_KEYS.JWT, accessToken, JWT_COOKIE_OPTIONS);

        return { user };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie(COOKIE_KEYS.JWT);

        return { message: 'Logged out successfully' };
    }
}
