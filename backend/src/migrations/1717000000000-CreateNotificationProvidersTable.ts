import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { NotificationProviderIntegrationType } from '@/entities/notification-provider';

export class CreateNotificationProvidersTable1717000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "notification_provider_integration_type_enum" AS ENUM(${Object.values(
                NotificationProviderIntegrationType
            )
                .map(type => `'${type}'`)
                .join(', ')})`
        );

        await queryRunner.createTable(
            new Table({
                name: 'notification_providers',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar(255)',
                        isUnique: true,
                    },
                    {
                        name: 'display_name',
                        type: 'varchar(255)',
                    },
                    {
                        name: 'integration_type',
                        type: 'notification_provider_integration_type_enum',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('notification_providers');
        await queryRunner.query('DROP TYPE "notification_provider_integration_type_enum"');
    }
}
