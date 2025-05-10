import { join } from 'path';

import { ConfigModuleOptions } from '@nestjs/config';

export const CONFIG_MODULE_OPTIONS: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: join(__dirname, '..', '..', '.env'),
    cache: true,
    expandVariables: true,
};
