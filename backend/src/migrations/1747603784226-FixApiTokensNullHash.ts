import { MigrationInterface, QueryRunner } from 'typeorm';

interface ColumnExistsResult {
    exists: boolean;
}

export class FixApiTokensNullHash1747603784226 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashColumnExists = (await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'api_tokens' AND column_name = 'hash'
            )
        `)) as ColumnExistsResult[];

        if (hashColumnExists[0].exists) {
            await queryRunner.query(`
                DELETE FROM "api_tokens"
                WHERE "hash" IS NULL
            `);

            await queryRunner.query(`
                ALTER TABLE "api_tokens"
                DROP COLUMN "hash"
            `);
        }

        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ADD COLUMN "hash" varchar(255)
        `);

        await queryRunner.query(`
            UPDATE "api_tokens"
            SET "hash" = 'temp_hash_' || id
            WHERE "hash" IS NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ALTER COLUMN "hash" SET NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ADD CONSTRAINT "UQ_api_tokens_hash" UNIQUE ("hash")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            DROP CONSTRAINT "UQ_api_tokens_hash"
        `);

        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ALTER COLUMN "hash" DROP NOT NULL
        `);

        await queryRunner.query(`
            UPDATE "api_tokens"
            SET "hash" = NULL
            WHERE "hash" LIKE 'temp_hash_%'
        `);
    }
}
