import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DATA_SOURCE_OPTIONS } from '@/db/data-source';

export const TYPEORM_MODULE_OPTIONS: TypeOrmModuleOptions = {
    ...DATA_SOURCE_OPTIONS,
    migrationsRun: true,
};
