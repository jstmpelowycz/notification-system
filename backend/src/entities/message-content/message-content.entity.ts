import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { MessageRevision } from '@/entities/message-revision';

@Entity('message_contents')
export class MessageContent extends BaseEntity {
    @Column({
        type: 'uuid',
        name: 'revision_id',
        unique: true,
    })
    revisionId: string;

    @OneToOne(() => MessageRevision, revision => revision.content)
    @JoinColumn({ name: 'revision_id' })
    revision: MessageRevision;

    @Column({ type: 'text' })
    content: string;
}
