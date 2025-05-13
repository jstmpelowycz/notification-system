import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificationChannelMessagesTable1717000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'notification_channel_messages',
                columns: [
                    {
                        name: 'message_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'channel_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                ],
                indices: [
                    {
                        name: 'PK_notification_channel_messages',
                        columnNames: ['message_id', 'channel_id'],
                        isUnique: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['message_id'],
                        referencedTableName: 'messages',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        columnNames: ['channel_id'],
                        referencedTableName: 'notification_channels',
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
        await queryRunner.dropTable('notification_channel_messages');
    }
}
