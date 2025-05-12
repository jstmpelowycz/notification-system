import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONFIG_MODULE_OPTIONS } from '@/configs/config-module-options';
import { TYPEORM_MODULE_OPTIONS } from '@/configs/typeorm-module-options';
import { ApiTokensModule } from '@/modules/api-tokens/api-tokens.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot(CONFIG_MODULE_OPTIONS),
        TypeOrmModule.forRoot(TYPEORM_MODULE_OPTIONS),
        ApiTokensModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
