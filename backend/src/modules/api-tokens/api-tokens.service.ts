import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ApiToken } from '@/entities/api-token';

import { API_TOKENS_ERROR_MESSAGES } from './constants/error-messages';
import { CreateTokenRequestDto, CreateTokenResponseDto } from './dto/create-token.dto';
import { createPlainTextToken } from './utils/create-plain-text-token';
import { createRandomToken } from './utils/create-random-token';

@Injectable()
export class ApiTokensService {
    constructor(
        @InjectRepository(ApiToken)
        private readonly apiTokensRepository: Repository<ApiToken>
    ) {}

    async create(requestDto: CreateTokenRequestDto): Promise<CreateTokenResponseDto> {
        const { prefix, token, hash } = createRandomToken();

        const apiToken = this.apiTokensRepository.create({
            hash,
            prefix,
            description: requestDto.description,
        });

        await this.apiTokensRepository.save(apiToken);

        const responseDto = new CreateTokenResponseDto();

        responseDto.plainTextToken = createPlainTextToken(prefix, token);
        responseDto.token = apiToken;

        return responseDto;
    }

    async findAll(): Promise<ApiToken[]> {
        return this.apiTokensRepository.find({
            where: {
                revokedAt: IsNull(),
            },
            order: {
                createdAt: 'desc',
            },
        });
    }

    async findByPrefix(prefix: string): Promise<ApiToken | null> {
        return this.apiTokensRepository.findOne({
            where: {
                prefix,
                revokedAt: IsNull(),
            },
        });
    }

    async revoke(id: string): Promise<void> {
        const token = await this.apiTokensRepository.findOne({
            where: { id },
        });

        if (!token) {
            throw new NotFoundException(API_TOKENS_ERROR_MESSAGES.TOKEN_NOT_FOUND);
        }

        token.revokedAt = new Date();

        await this.apiTokensRepository.save(token);
    }
}
