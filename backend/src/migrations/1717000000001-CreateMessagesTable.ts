import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMessagesTable1717000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'messages',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'slug',
                        type: 'varchar(255)',
                        isUnique: true,
                    },
                    {
                        name: 'description',
                        type: 'varchar(500)',
                        isNullable: true,
                    },
                    {
                        name: 'current_revision_id',
                        type: 'uuid',
                        isNullable: true,
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
        await queryRunner.dropTable('messages');
    }
}
