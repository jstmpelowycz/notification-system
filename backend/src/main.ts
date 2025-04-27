import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

const main = async () => {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT ?? 3000);
};

main()
    .then(() => {
        console.log('Server is running 🚀', process.env.PORT);
    })
    .catch(() => {
        console.log('Server failed to launch 💀');
    });
