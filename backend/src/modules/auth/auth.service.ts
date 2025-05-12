import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CONFIG_KEYS } from '@/constants/config-keys';
import { User } from '@/entities/user';
import { AUTH_ERROR_MESSAGES } from '@/modules/auth/constants/error-messages';
import { LoginUserRequestDto } from '@/modules/auth/dto/login-user.dto';
import { CreateUserRequestDto, CreateUserResponseDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    login(user: User): CreateUserResponseDto {
        const payload = { email: user.email, sub: user.id };

        const jwtSecret = this.configService.get<string>(CONFIG_KEYS.JWT_SECRET);
        const jwtExpiresIn = this.configService.get<string>(CONFIG_KEYS.JWT_EXPIRES_IN);

        const accessToken = this.jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn: jwtExpiresIn,
        });

        const dto = new CreateUserResponseDto();

        dto.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        dto.accessToken = accessToken;

        return dto;
    }

    async register(createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);

        if (existingUser) {
            throw new BadRequestException(AUTH_ERROR_MESSAGES.ALREADY_EXISTS);
        }

        const newUser = await this.usersService.create(createUserDto);

        return this.login(newUser);
    }

    async validate(dto: LoginUserRequestDto): Promise<User> {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await this.usersService.validatePassword(user, dto.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        return user;
    }
}
