import { Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { DispatchService } from './dispatch.service';
import { DispatchMessageResponseDto } from './dto/dispatch-message.dto';

@Controller('dispatch')
@UseGuards(JwtAuthGuard)
export class DispatchController {
    constructor(private readonly dispatchService: DispatchService) {}

    @Post('messages/:id')
    @HttpCode(HttpStatus.OK)
    async dispatchMessage(@Param('id', ParseUUIDPipe) id: string): Promise<DispatchMessageResponseDto> {
        const result = await this.dispatchService.dispatchMessage(id);

        return { result };
    }
}
