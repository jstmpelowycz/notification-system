import { Module } from '@nestjs/common';

import { MessagesModule } from '@/modules/messages/messages.module';

import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DispatchStrategyFactory } from './factories/dispatch-strategy.factory';
import { DiscordDispatchStrategy } from './strategies/discord-dispatch.strategy';
import { MSTeamsDispatchStrategy } from './strategies/ms-teams-dispatch.strategy';

@Module({
    imports: [MessagesModule],
    controllers: [DispatchController],
    providers: [DispatchService, DispatchStrategyFactory, DiscordDispatchStrategy, MSTeamsDispatchStrategy],
    exports: [DispatchService],
})
export class DispatchModule {}
