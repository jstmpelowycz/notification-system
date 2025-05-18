import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';

import { CreateMessageRequestDto, CreateMessageResponseDto } from './dto/create-message.dto';
import { FindAllMessagesResponseDto, FindByQueryMessagesRequestDto } from './dto/find-all-messages.dto';
import { GetMessageResponseDto } from './dto/get-message.dto';
import { ManageRevisionRequestDto, ManageRevisionResponseDto } from './dto/manage-revision.dto';
import { UpdateMessageStatusRequestDto, UpdateMessageStatusResponseDto } from './dto/update-message-status.dto';
import { UpdateMessageRequestDto, UpdateMessageResponseDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    async findByQuery(@Query() query: FindByQueryMessagesRequestDto): Promise<FindAllMessagesResponseDto> {
        const [messages, total] = await this.messagesService.findByQuery(query);

        return { messages, total };
    }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<GetMessageResponseDto> {
        const message = await this.messagesService.getById(id);

        return { message };
    }

    @Post()
    async create(@Body() dto: CreateMessageRequestDto): Promise<CreateMessageResponseDto> {
        const message = await this.messagesService.create(dto);

        return { message };
    }

    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateMessageRequestDto
    ): Promise<UpdateMessageResponseDto> {
        const message = await this.messagesService.update(id, dto);

        return { message };
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateMessageStatusRequestDto
    ): Promise<UpdateMessageStatusResponseDto> {
        const message = await this.messagesService.updateStatus(id, dto.status);

        return { message };
    }

    @Post(':messageId/revisions/:revisionId/activate')
    async activateRevision(@Param() dto: ManageRevisionRequestDto): Promise<ManageRevisionResponseDto> {
        const message = await this.messagesService.activateRevision(dto);

        return { message };
    }
}
