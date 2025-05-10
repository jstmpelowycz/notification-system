import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DATA_SOURCE_OPTIONS } from '@/configs/data-source-options';

export const TYPEORM_MODULE_OPTIONS: TypeOrmModuleOptions = {
    ...DATA_SOURCE_OPTIONS,
    migrationsRun: true,
};
