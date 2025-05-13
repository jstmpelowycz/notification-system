import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { NotificationChannelStatus } from '@/entities/notification-channel';

export class CreateNotificationChannelsTable1717000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "notification_channel_status_enum" AS ENUM(${Object.values(NotificationChannelStatus)
                .map(status => `'${status}'`)
                .join(', ')})`
        );

        await queryRunner.createTable(
            new Table({
                name: 'notification_channels',
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
                    },
                    {
                        name: 'status',
                        type: 'notification_channel_status_enum',
                        default: `'${NotificationChannelStatus.INACTIVE}'`,
                    },
                    {
                        name: 'config',
                        type: 'jsonb',
                    },
                    {
                        name: 'provider_id',
                        type: 'uuid',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['provider_id'],
                        referencedTableName: 'notification_providers',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('notification_channels');
        await queryRunner.query('DROP TYPE "notification_channel_status_enum"');
    }
}
