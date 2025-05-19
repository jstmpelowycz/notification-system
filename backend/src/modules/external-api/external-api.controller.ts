import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import {
    DispatchMessageBySlugRequestDto,
    DispatchMessageBySlugResponseDto,
} from '@/modules/external-api/dto/dispatch-message-by-slug.dto';
import { ApiTokenAuthGuard } from '@/modules/external-api/guards/api-token-auth.guard';

import { ExternalApiService } from './external-api.service';

@Controller('external-api')
@UseGuards(ApiTokenAuthGuard)
export class ExternalApiController {
    constructor(private readonly externalApiService: ExternalApiService) {}

    @Post('dispatch')
    @HttpCode(HttpStatus.OK)
    async dispatchMessageBySlug(
        @Body() dto: DispatchMessageBySlugRequestDto
    ): Promise<DispatchMessageBySlugResponseDto> {
        const result = await this.externalApiService.dispatchMessageBySlug(dto.slug);

        return { result };
    }
}
