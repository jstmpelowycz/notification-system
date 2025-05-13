import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageStatusColumn1684157836742 implements MigrationInterface {
    name = 'AddMessageStatusColumn1684157836742';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."messages_status_enum" AS ENUM('active', 'inactive')
        `);

        await queryRunner.query(`
            ALTER TABLE "messages" 
            ADD COLUMN "status" "messages_status_enum" NOT NULL DEFAULT 'inactive'::"messages_status_enum"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "messages" DROP COLUMN "status"
        `);

        await queryRunner.query(`
            DROP TYPE "public"."messages_status_enum"
        `);
    }
}
