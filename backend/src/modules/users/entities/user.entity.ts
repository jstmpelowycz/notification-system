import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ name: 'first_name', default: '' })
    firstName: string;

    @Column({ name: 'last_name', default: '' })
    lastName: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
