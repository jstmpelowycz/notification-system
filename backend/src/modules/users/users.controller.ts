import { Controller, Get, Param, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { FindUserResponseDto } from './dto/find-user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<FindUserResponseDto> {
        const user = await this.usersService.findById(id);

        return { user };
    }
}
