import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { Message } from '@/entities/message';
import { MessageContent } from '@/entities/message-content';

import { generateDisplayId } from './generators/generate-display-id';

export enum MessageRevisionStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    LOCKED = 'locked',
}

@Entity('message_revisions')
@Unique(['messageId', 'displayId'])
export class MessageRevision extends BaseEntity {
    @Column({ name: 'display_id' })
    displayId: number;

    @Column({
        type: 'enum',
        enum: MessageRevisionStatus,
        default: MessageRevisionStatus.DRAFT,
    })
    status: MessageRevisionStatus;

    @Column({ name: 'message_id', type: 'uuid' })
    messageId: string;

    @ManyToOne(() => Message, message => message.revisions)
    @JoinColumn({ name: 'message_id' })
    message: Message;

    @OneToOne(() => MessageContent, content => content.revision)
    content: MessageContent;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;

    @BeforeInsert()
    async generateDisplayId() {
        return generateDisplayId(this);
    }
}
