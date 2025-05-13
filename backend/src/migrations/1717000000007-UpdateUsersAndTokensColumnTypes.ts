import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersAndTokensColumnTypes1717000000007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update users table column types
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "email" TYPE varchar(255),
            ALTER COLUMN "password_hash" TYPE varchar(255),
            ALTER COLUMN "first_name" TYPE varchar(255),
            ALTER COLUMN "last_name" TYPE varchar(255),
            ALTER COLUMN "created_at" TYPE timestamp with time zone;
        `);

        // Update api_tokens table column types
        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ALTER COLUMN "hash" TYPE varchar(255),
            ALTER COLUMN "prefix" TYPE varchar(64),
            ALTER COLUMN "description" TYPE varchar(500),
            ALTER COLUMN "created_at" TYPE timestamp with time zone,
            ALTER COLUMN "revoked_at" TYPE timestamp with time zone;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert api_tokens table column types
        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ALTER COLUMN "hash" TYPE varchar,
            ALTER COLUMN "prefix" TYPE varchar,
            ALTER COLUMN "description" TYPE varchar,
            ALTER COLUMN "created_at" TYPE timestamp,
            ALTER COLUMN "revoked_at" TYPE timestamp;
        `);

        // Revert users table column types
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "email" TYPE varchar,
            ALTER COLUMN "password_hash" TYPE varchar,
            ALTER COLUMN "first_name" TYPE varchar,
            ALTER COLUMN "last_name" TYPE varchar,
            ALTER COLUMN "created_at" TYPE timestamp;
        `);
    }
}
