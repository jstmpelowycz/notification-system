import { join } from 'path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from './src/modules/users/entities/user.entity';

dotenv.config({ path: join(__dirname, '.env') });

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    migrations: [join(__dirname, 'src', 'migrations', '*.ts')],
    synchronize: false,
    migrationsRun: false,
});
