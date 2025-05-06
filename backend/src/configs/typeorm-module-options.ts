import { join } from 'path';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '@/modules/users/entities/user.entity';

export const TYPEORM_MODULE_OPTIONS: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: false,
    migrationsRun: true,
};
