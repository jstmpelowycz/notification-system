import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserNames1714320100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('users', [
            new TableColumn({
                name: 'first_name',
                type: 'varchar',
                isNullable: false,
                default: "''",
            }),
            new TableColumn({
                name: 'last_name',
                type: 'varchar',
                isNullable: false,
                default: "''",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('users', ['first_name', 'last_name']);
    }
}
