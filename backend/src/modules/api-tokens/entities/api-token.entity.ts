import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('api_tokens')
export class ApiToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    hash: string;

    @Column({ unique: true })
    prefix: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'revoked_at', nullable: true })
    revokedAt: Date;
}
