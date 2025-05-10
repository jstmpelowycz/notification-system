import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiToken } from '@/entities/api-token.entity';

import { ApiTokensController } from './api-tokens.controller';
import { ApiTokensService } from './api-tokens.service';

@Module({
    imports: [TypeOrmModule.forFeature([ApiToken])],
    providers: [ApiTokensService],
    controllers: [ApiTokensController],
    exports: [TypeOrmModule, ApiTokensService],
})
export class ApiTokensModule {}
