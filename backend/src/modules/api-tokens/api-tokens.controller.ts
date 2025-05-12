import { Controller, Post, Get, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';

import { ApiToken } from '@/entities/api-token';
import { CreateApiTokenRequestDto, CreateApiTokenResponseDto } from '@/modules/api-tokens/dto/create-api-token.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiTokensService } from './api-tokens.service';

@Controller('api-tokens')
@UseGuards(JwtAuthGuard)
export class ApiTokensController {
    constructor(private readonly apiTokensService: ApiTokensService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateApiTokenRequestDto): Promise<CreateApiTokenResponseDto> {
        return this.apiTokensService.create(dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ApiToken[]> {
        return this.apiTokensService.findAll();
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async revoke(@Param('id') id: string): Promise<void> {
        await this.apiTokensService.revoke(id);
    }
}
