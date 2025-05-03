import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';

config();

const baseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    migrations: [__dirname + '/../migrations/*.ts'],
    synchronize: false,
};

export const dbConfig: TypeOrmModuleOptions = {
    ...baseConfig,
    migrationsRun: true,
};

export const RootDataSource = new DataSource({
    ...baseConfig,
    migrationsRun: false,
});
