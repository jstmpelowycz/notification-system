import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import dataSource from '@/db/data-source';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // TODO: Must be specific per env
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    await dataSource.initialize();

    const port = process.env.PORT;

    if (!port) {
        throw new Error('Port cannot be unset!');
    }

    await app.listen(port);

    return port;
}

bootstrap()
    .then(port => {
        console.log(`Server running on port ${port} 🚀`);
    })
    .catch(err => {
        console.error('Error starting server:', err);
        process.exit(1);
    });
