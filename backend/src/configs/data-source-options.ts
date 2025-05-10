import { join } from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';

// Note: Intentional non-alias import for CLI
import { User } from '../modules/users/entities/user.entity';

export const DATA_SOURCE_OPTIONS: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: false,
};

export default new DataSource(DATA_SOURCE_OPTIONS);
