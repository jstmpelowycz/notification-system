import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMessageRevisionsTable1717000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "message_revision_status_enum" AS ENUM('active', 'locked')
        `);

        await queryRunner.createTable(
            new Table({
                name: 'message_revisions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'display_id',
                        type: 'integer',
                    },
                    {
                        name: 'status',
                        type: 'message_revision_status_enum',
                    },
                    {
                        name: 'message_id',
                        type: 'uuid',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp with time zone',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        default: 'CURRENT_TIMESTAMP',
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
                ],
                indices: [
                    {
                        name: 'IDX_message_revisions_message_id_display_id',
                        columnNames: ['message_id', 'display_id'],
                        isUnique: true,
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('message_revisions');
        await queryRunner.query('DROP TYPE "message_revision_status_enum"');
    }
}
