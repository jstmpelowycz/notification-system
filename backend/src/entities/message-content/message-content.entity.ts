import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/entities/base.entity';
import { MessageRevision } from '@/entities/message-revision';

@Entity('message_contents')
export class MessageContent extends BaseEntity {
    @Column({
        name: 'revision_id',
        type: 'uuid',
        unique: true,
    })
    revisionId: string;

    @OneToOne(() => MessageRevision, revision => revision.content)
    @JoinColumn({ name: 'revision_id' })
    revision: MessageRevision;

    @Column()
    content: string;
}
