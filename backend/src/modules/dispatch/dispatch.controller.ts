import { Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { DispatchService } from './dispatch.service';
import { DispatchMessageResult } from './types/dispatch-message-result';

@Controller('dispatch')
@UseGuards(JwtAuthGuard)
export class DispatchController {
    constructor(private readonly dispatchService: DispatchService) {}

    @Post('messages/:id')
    @HttpCode(HttpStatus.OK)
    async dispatchMessage(@Param('id', ParseUUIDPipe) id: string): Promise<DispatchMessageResult> {
        return this.dispatchService.dispatchMessage(id);
    }
}
