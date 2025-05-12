import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { NotificationChannel } from '@/entities/notification-channel';

export enum NotificationProviderIntegrationType {
    WEBHOOK = 'webhook',
}

@Entity('notification_providers')
export class NotificationProvider extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column({ name: 'display_name' })
    displayName: string;

    @Column({
        name: 'integration_type',
        type: 'enum',
        enum: NotificationProviderIntegrationType,
    })
    integrationType: NotificationProviderIntegrationType;

    @OneToMany(() => NotificationChannel, channel => channel.provider)
    channels: NotificationChannel[];
}
