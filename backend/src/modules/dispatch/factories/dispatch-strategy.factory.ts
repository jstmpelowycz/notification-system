import { Injectable } from '@nestjs/common';

import { NotificationProviderType } from '@/entities/notification-provider';
import { DISPATCH_ERROR_MESSAGES } from '@/modules/dispatch/constants/error-messages';
import { DiscordDispatchStrategy } from '@/modules/dispatch/strategies/discord-dispatch.strategy';
import { DispatchStrategy } from '@/modules/dispatch/strategies/dispatch-strategy.interface';
import { MSTeamsDispatchStrategy } from '@/modules/dispatch/strategies/ms-teams-dispatch.strategy';

@Injectable()
export class DispatchStrategyFactory {
    constructor(
        private readonly discordStrategy: DiscordDispatchStrategy,
        private readonly msTeamsStrategy: MSTeamsDispatchStrategy
    ) {}

    getStrategy(type: NotificationProviderType): DispatchStrategy {
        switch (type) {
            case NotificationProviderType.DISCORD:
                return this.discordStrategy;
            case NotificationProviderType.MS_TEAMS:
                return this.msTeamsStrategy;
            default:
                throw new Error(DISPATCH_ERROR_MESSAGES.UNSUPPORTED_PROVIDER);
        }
    }
}
