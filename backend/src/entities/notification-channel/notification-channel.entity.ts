import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { Message } from '@/entities/message';
import { NotificationProvider, NotificationProviderIntegrationType } from '@/entities/notification-provider';

import { WEBHOOK_PROVIDER_INTEGRATION_TYPE_CONFIG_VALIDATION_RULE } from './validation/config-validation-rule';

export enum NotificationChannelStatus {
    INACTIVE = 'inactive',
    ACTIVE = 'active',
}

@Entity('notification_channels')
export class NotificationChannel extends BaseEntity {
    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: NotificationChannelStatus,
        default: NotificationChannelStatus.INACTIVE,
    })
    status: NotificationChannelStatus;

    @Column({ type: 'jsonb' })
    config: Record<string, unknown>;

    @Column({ type: 'uuid', name: 'provider_id' })
    providerId: string;

    @ManyToOne(() => NotificationProvider, provider => provider.channels)
    @JoinColumn({ name: 'provider_id' })
    provider: NotificationProvider;

    @ManyToMany(() => Message, message => message.channels)
    messages: Message[];

    @BeforeInsert()
    validateConfig() {
        switch (this.provider.integrationType) {
            case NotificationProviderIntegrationType.WEBHOOK:
                if (!WEBHOOK_PROVIDER_INTEGRATION_TYPE_CONFIG_VALIDATION_RULE.validate(this.config)) {
                    throw new Error(WEBHOOK_PROVIDER_INTEGRATION_TYPE_CONFIG_VALIDATION_RULE.errorMessage);
                }
        }
    }
}
