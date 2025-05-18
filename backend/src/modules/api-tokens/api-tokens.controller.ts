import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';

import { ApiToken } from '@/entities/api-token';
import { ApiTokensService } from '@/modules/api-tokens/api-tokens.service';
import { CreateTokenRequestDto, CreateTokenResponseDto } from '@/modules/api-tokens/dto/create-token.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

export class FindAllTokensResponseDto {
    tokens: ApiToken[];
}

@Controller('api-tokens')
@UseGuards(JwtAuthGuard)
export class ApiTokensController {
    constructor(private readonly apiTokensService: ApiTokensService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateTokenRequestDto): Promise<CreateTokenResponseDto> {
        return this.apiTokensService.create(dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<FindAllTokensResponseDto> {
        const tokens = await this.apiTokensService.findAll();

        return { tokens };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async revoke(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.apiTokensService.revoke(id);
    }
}
