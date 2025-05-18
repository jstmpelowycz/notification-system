import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';

import { CreateChannelRequestDto, CreateChannelResponseDto } from './dto/create-channel.dto';
import { FindAllChannelsResponseDto } from './dto/find-all-channels.dto';
import { FindChannelResponseDto } from './dto/find-channel.dto';
import { UpdateChannelRequestDto, UpdateChannelResponseDto } from './dto/update-channel.dto';
import { NotificationChannelsService } from './notification-channels.service';

@Controller('notification-channels')
export class NotificationChannelsController {
    constructor(private readonly notificationChannelsService: NotificationChannelsService) {}

    @Get()
    async findAll(): Promise<FindAllChannelsResponseDto> {
        const channels = await this.notificationChannelsService.findAll();

        return { channels };
    }

    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<FindChannelResponseDto> {
        const channel = await this.notificationChannelsService.findById(id);

        return { channel };
    }

    @Post()
    async create(@Body() dto: CreateChannelRequestDto): Promise<CreateChannelResponseDto> {
        const channel = await this.notificationChannelsService.create(dto);

        return { channel };
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateChannelRequestDto
    ): Promise<UpdateChannelResponseDto> {
        const channel = await this.notificationChannelsService.update(id, dto);

        return { channel };
    }
}
