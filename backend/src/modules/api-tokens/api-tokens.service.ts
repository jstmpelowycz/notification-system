import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ApiToken } from '@/entities/api-token';
import { CreateApiTokenRequestDto, CreateApiTokenResponseDto } from '@/modules/api-tokens/dto/create-api-token.dto';
import { createPlainTextToken } from '@/modules/api-tokens/utils/create-plain-text-token';
import { createRandomToken } from '@/modules/api-tokens/utils/create-random-token';

import { API_TOKENS_ERROR_MESSAGES } from './constants/error-messages';

@Injectable()
export class ApiTokensService {
    constructor(
        @InjectRepository(ApiToken)
        private apiTokensRepository: Repository<ApiToken>
    ) {}

    async create(requestDto: CreateApiTokenRequestDto): Promise<CreateApiTokenResponseDto> {
        const { prefix, token, hash } = createRandomToken();

        const apiToken = this.apiTokensRepository.create({
            hash,
            prefix,
            description: requestDto.description,
        });

        await this.apiTokensRepository.save(apiToken);

        const responseDto = new CreateApiTokenResponseDto();

        responseDto.plainTextToken = createPlainTextToken(prefix, token);
        responseDto.apiToken = apiToken;

        return responseDto;
    }

    async findAll(): Promise<ApiToken[]> {
        return this.apiTokensRepository.find({
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
