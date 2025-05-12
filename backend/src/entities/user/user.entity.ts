import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;
}
