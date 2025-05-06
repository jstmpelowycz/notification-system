import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await this.usersService.validatePassword(user, password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }

    login(user: User) {
        const payload = { email: user.email, sub: user.id };

        const jwtSecret = this.configService.get<string>('JWT_SECRET');

        const accessToken = this.jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn: '24h',
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken,
        };
    }

    async register(createUserDto: CreateUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const newUser = await this.usersService.create(createUserDto);

        return this.login(newUser);
    }
}
