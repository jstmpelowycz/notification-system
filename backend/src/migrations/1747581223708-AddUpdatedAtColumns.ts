import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdatedAtColumns1747581223708 implements MigrationInterface {
    name = 'AddUpdatedAtColumns1747581223708';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "api_tokens" 
            ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);

        await queryRunner.query(`
            UPDATE "api_tokens" SET "updated_at" = "created_at"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "api_tokens" DROP COLUMN "updated_at"
        `);
    }
}
