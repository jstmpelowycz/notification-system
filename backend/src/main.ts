import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';

import { AppModule } from './app.module';

config();

const main = async () => {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT);
};

main()
    .then(() => {
        console.log('Server is running 🚀', process.env.PORT);
    })
    .catch(() => {
        console.log('Server failed to launch 💀');
    });
