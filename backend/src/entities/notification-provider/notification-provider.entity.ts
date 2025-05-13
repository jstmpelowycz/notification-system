import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { NotificationChannel } from '@/entities/notification-channel';

export enum NotificationProviderIntegrationType {
    WEBHOOK = 'webhook',
}

@Entity('notification_providers')
export class NotificationProvider extends BaseEntity {
    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column({ type: 'varchar', name: 'display_name' })
    displayName: string;

    @Column({
        type: 'enum',
        enum: NotificationProviderIntegrationType,
        name: 'integration_type',
    })
    integrationType: NotificationProviderIntegrationType;

    @OneToMany(() => NotificationChannel, channel => channel.provider)
    channels: NotificationChannel[];
}
