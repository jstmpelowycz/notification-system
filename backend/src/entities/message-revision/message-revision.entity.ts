import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { Message } from '@/entities/message';
import { MessageContent } from '@/entities/message-content';

import { generateDisplayId } from './generators/generate-display-id';

export enum MessageRevisionStatus {
    LOCKED = 'locked',
    ACTIVE = 'active',
}

@Entity('message_revisions')
@Unique(['messageId', 'displayId'])
export class MessageRevision extends BaseEntity {
    @Column({ type: 'integer', name: 'display_id' })
    displayId: number;

    @Column({
        type: 'enum',
        enum: MessageRevisionStatus,
    })
    status: MessageRevisionStatus;

    @Column({ type: 'uuid', name: 'message_id' })
    messageId: string;

    @ManyToOne(() => Message, message => message.revisions)
    @JoinColumn({ name: 'message_id' })
    message: Message;

    @OneToOne(() => MessageContent, content => content.revision)
    content: MessageContent;

    @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
    deletedAt: Date | null;

    @BeforeInsert()
    async generateDisplayId() {
        return generateDisplayId(this);
    }
}
