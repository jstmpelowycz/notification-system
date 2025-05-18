import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateApiTokenDescriptionType1747581674830 implements MigrationInterface {
    name = 'UpdateApiTokenDescriptionType1747581674830';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ALTER COLUMN "description" TYPE text USING description::text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ALTER COLUMN "description" TYPE varchar(500) USING description::varchar(500)
        `);
    }
}
