import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdatedAtColumn1684157927558 implements MigrationInterface {
    name = 'AddUpdatedAtColumn1684157927558';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notification_providers" 
            ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);

        await queryRunner.query(`
            ALTER TABLE "notification_channels" 
            ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);

        await queryRunner.query(`
            ALTER TABLE "messages" 
            ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);

        await queryRunner.query(`
            ALTER TABLE "message_revisions" 
            ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);

        await queryRunner.query(`
            ALTER TABLE "message_contents" 
            ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);

        await queryRunner.query(`
            UPDATE "notification_providers" SET "updated_at" = "created_at"
        `);

        await queryRunner.query(`
            UPDATE "notification_channels" SET "updated_at" = "created_at"
        `);

        await queryRunner.query(`
            UPDATE "messages" SET "updated_at" = "created_at"
        `);

        await queryRunner.query(`
            UPDATE "message_revisions" SET "updated_at" = "created_at"
        `);

        await queryRunner.query(`
            UPDATE "message_contents" SET "updated_at" = "created_at"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "message_contents" DROP COLUMN "updated_at"
        `);

        await queryRunner.query(`
            ALTER TABLE "message_revisions" DROP COLUMN "updated_at"
        `);

        await queryRunner.query(`
            ALTER TABLE "messages" DROP COLUMN "updated_at"
        `);

        await queryRunner.query(`
            ALTER TABLE "notification_channels" DROP COLUMN "updated_at"
        `);

        await queryRunner.query(`
            ALTER TABLE "notification_providers" DROP COLUMN "updated_at"
        `);
    }
}
