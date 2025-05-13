import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';

@Entity('api_tokens')
export class ApiToken extends BaseEntity {
    @Column({ type: 'varchar', unique: true })
    hash: string;

    @Column({ type: 'varchar', unique: true })
    prefix: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({
        type: 'timestamptz',
        name: 'revoked_at',
        nullable: true,
    })
    revokedAt: Date | null;
}
