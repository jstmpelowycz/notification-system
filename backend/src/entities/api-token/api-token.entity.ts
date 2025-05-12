import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';

@Entity('api_tokens')
export class ApiToken extends BaseEntity {
    @Column({ unique: true })
    hash: string;

    @Column({ unique: true })
    prefix: string;

    @Column({ nullable: true })
    description: string | null;

    @Column({ name: 'revoked_at', nullable: true })
    revokedAt: Date | null;
}
