import { MigrationInterface, QueryRunner } from 'typeorm';

interface EnumExistsResult {
    exists: boolean;
}

interface ColumnExistsResult {
    exists: boolean;
}

export class UpdateNotificationProviderFields1747603750833 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const enumExists = (await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'notification_provider_type_enum'
            )
        `)) as EnumExistsResult[];

        if (!enumExists[0].exists) {
            await queryRunner.query(`CREATE TYPE "notification_provider_type_enum" AS ENUM('discord', 'ms_teams')`);
        }

        const typeColumnExists = (await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'notification_providers' AND column_name = 'type'
            )
        `)) as ColumnExistsResult[];

        if (!typeColumnExists[0].exists) {
            await queryRunner.query(`
                ALTER TABLE "notification_providers"
                ADD COLUMN "type" notification_provider_type_enum NOT NULL DEFAULT 'discord'
            `);

            await queryRunner.query(`
                UPDATE "notification_providers"
                SET "type" = CASE
                    WHEN "name" ILIKE '%discord%' THEN 'discord'
                    WHEN "name" ILIKE '%teams%' THEN 'ms_teams'
                    ELSE 'discord'
                END
            `);
        }

        const nameColumnExists = (await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'notification_providers' AND column_name = 'name'
            )
        `)) as ColumnExistsResult[];

        if (nameColumnExists[0].exists) {
            await queryRunner.query(`
                ALTER TABLE "notification_providers"
                DROP COLUMN "name"
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const nameColumnExists = (await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'notification_providers' AND column_name = 'name'
            )
        `)) as ColumnExistsResult[];

        if (!nameColumnExists[0].exists) {
            await queryRunner.query(`
                ALTER TABLE "notification_providers"
                ADD COLUMN "name" varchar(255)
            `);

            await queryRunner.query(`
                UPDATE "notification_providers"
                SET "name" = CASE
                    WHEN "type" = 'discord' THEN 'discord'
                    WHEN "type" = 'ms_teams' THEN 'ms_teams'
                END
            `);
        }

        const typeColumnExists = (await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'notification_providers' AND column_name = 'type'
            )
        `)) as ColumnExistsResult[];

        if (typeColumnExists[0].exists) {
            await queryRunner.query(`
                ALTER TABLE "notification_providers"
                DROP COLUMN "type"
            `);
        }

        const enumExists = (await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'notification_provider_type_enum'
            )
        `)) as EnumExistsResult[];

        if (enumExists[0].exists) {
            await queryRunner.query(`DROP TYPE "notification_provider_type_enum"`);
        }
    }
}
