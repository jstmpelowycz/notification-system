import { Module } from '@nestjs/common';

import { ApiTokensModule } from '@/modules/api-tokens/api-tokens.module';
import { DispatchModule } from '@/modules/dispatch/dispatch.module';
import { MessagesModule } from '@/modules/messages/messages.module';

import { ExternalApiController } from './external-api.controller';
import { ExternalApiService } from './external-api.service';

@Module({
    imports: [ApiTokensModule, MessagesModule, DispatchModule],
    controllers: [ExternalApiController],
    providers: [ExternalApiService],
})
export class ExternalApiModule {}
