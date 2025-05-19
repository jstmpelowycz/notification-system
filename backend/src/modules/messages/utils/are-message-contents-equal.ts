import { Message } from '@/entities/message';

export const areMessageContentsEqual = (content: Record<string, unknown>, message: Message): boolean => {
    const { content: existingContent } = message.currentRevision.content;
    const inputContent = JSON.stringify(content);

    return inputContent === existingContent;
};
