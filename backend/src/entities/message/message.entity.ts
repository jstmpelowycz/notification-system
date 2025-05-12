import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { MessageRevision } from '@/entities/message-revision';
import { NotificationChannel } from '@/entities/notification-channel';

@Entity('messages')
export class Message extends BaseEntity {
    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    description: string | null;

    @Column({ name: 'current_revision_id', type: 'uuid' })
    currentRevisionId: string;

    @OneToOne(() => MessageRevision)
    @JoinColumn({ name: 'current_revision_id' })
    currentRevision: MessageRevision;

    @OneToMany(() => MessageRevision, revision => revision.message)
    revisions: MessageRevision[];

    @ManyToMany(() => NotificationChannel, channel => channel.messages)
    @JoinTable({
        name: 'notification_channel_messages',
        joinColumn: {
            name: 'message_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'channel_id',
            referencedColumnName: 'id',
        },
    })
    channels: NotificationChannel[];
}
