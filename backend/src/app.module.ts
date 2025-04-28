import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/modules/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig } from './configs/db.config';

@Module({
    imports: [TypeOrmModule.forRoot(dbConfig), UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
