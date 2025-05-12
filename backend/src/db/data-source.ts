import { join } from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';

import entities from '../entities';

export const DATA_SOURCE_OPTIONS: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: false,
    entities,
};

export default new DataSource(DATA_SOURCE_OPTIONS);
