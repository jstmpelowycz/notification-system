import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', name: 'password_hash' })
    passwordHash: string;

    @Column({ type: 'varchar', name: 'first_name' })
    firstName: string;

    @Column({ type: 'varchar', name: 'last_name' })
    lastName: string;
}
