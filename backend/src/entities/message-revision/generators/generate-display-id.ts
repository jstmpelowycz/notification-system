import dataSource from '@/db/data-source';
import { MessageRevision } from '@/entities/message-revision';

export async function generateDisplayId(revision: MessageRevision): Promise<void> {
    const repository = dataSource.getRepository(MessageRevision);

    const result = await repository
        .createQueryBuilder('revision')
        .select('MAX(revision.displayId)', 'maxDisplayId')
        .where('revision.messageId = :messageId', { messageId: revision.messageId })
        .getRawOne<{ maxDisplayId: number | null }>();

    const maxDisplayId = result?.maxDisplayId ?? 0;

    revision.displayId = maxDisplayId + 1;
}
