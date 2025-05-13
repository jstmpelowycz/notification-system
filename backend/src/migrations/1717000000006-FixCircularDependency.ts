import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCircularDependency1717000000006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "messages" ADD CONSTRAINT "FK_messages_current_revision_id"
            FOREIGN KEY ("current_revision_id") REFERENCES "message_revisions" ("id")
            ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "messages" DROP CONSTRAINT "FK_messages_current_revision_id";
        `);
    }
}
