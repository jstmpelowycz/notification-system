import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { MessageContent } from '@/entities/message-content';
import { MessageRevision, MessageRevisionStatus } from '@/entities/message-revision';
import { MESSAGE_REVISION_ERROR_MESSAGES } from '@/modules/message-revisions/constants/error-messages';

interface CreateRevisionOptions {
    messageId: string;
    content: Record<string, unknown>;
}

@Injectable()
export class MessageRevisionsService {
    constructor(
        @InjectRepository(MessageRevision)
        private readonly messageRevisionRepository: Repository<MessageRevision>,
        private readonly dataSource: DataSource
    ) {}

    async create(options: CreateRevisionOptions, manager?: EntityManager): Promise<MessageRevision> {
        const { messageId, content } = options;

        const operation = async (transactionalManager: EntityManager) => {
            const revision = transactionalManager.create(MessageRevision, {
                messageId,
                status: MessageRevisionStatus.ACTIVE,
            });

            await transactionalManager.save(revision);

            const messageContent = transactionalManager.create(MessageContent, {
                revisionId: revision.id,
                content: JSON.stringify(content),
            });

            await transactionalManager.save(messageContent);

            revision.content = messageContent;

            return revision;
        };

        if (manager) {
            return operation(manager);
        } else {
            return this.dataSource.transaction(operation);
        }
    }

    async activate(id: string): Promise<MessageRevision> {
        return this.updateStatus(id, MessageRevisionStatus.ACTIVE);
    }

    async lock(id: string): Promise<MessageRevision> {
        return this.updateStatus(id, MessageRevisionStatus.LOCKED);
    }

    private async updateStatus(id: string, nextStatus: MessageRevisionStatus): Promise<MessageRevision> {
        const prevStatus = this.getOppositeStatus(nextStatus);

        const revision = await this.messageRevisionRepository.findOne({
            where: {
                id,
                status: prevStatus,
            },
            relations: ['content'],
        });

        if (!revision) {
            throw new Error(MESSAGE_REVISION_ERROR_MESSAGES.REVISION_NOT_FOUND);
        }

        if (revision.status === nextStatus) {
            throw new Error(MESSAGE_REVISION_ERROR_MESSAGES.INVALID_STATUS_TRANSITION);
        }

        revision.status = nextStatus;

        return this.messageRevisionRepository.save(revision);
    }

    private getOppositeStatus(prevStatus: MessageRevisionStatus): MessageRevisionStatus {
        switch (prevStatus) {
            case MessageRevisionStatus.LOCKED:
                return MessageRevisionStatus.ACTIVE;
            case MessageRevisionStatus.ACTIVE:
                return MessageRevisionStatus.LOCKED;
        }
    }
}
