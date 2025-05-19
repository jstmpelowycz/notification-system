import { Message } from '@/entities/message';

export const areMessageChannelIdsEqual = (inputChannelIds: string[], message: Message): boolean => {
    const existingChannelIds = message.channels.map(channel => channel.id);

    if (inputChannelIds.length !== existingChannelIds.length) {
        return false;
    }

    const sortFn = (a: string, b: string) => String(a).localeCompare(String(b));

    const sortedInputChannelIds = [...inputChannelIds].sort(sortFn);
    const sortedExistingChannelIds = [...existingChannelIds].sort(sortFn);

    for (let i = 0; i < sortedInputChannelIds.length; i++) {
        if (sortedInputChannelIds[i] !== sortedExistingChannelIds[i]) {
            return false;
        }
    }

    return true;
};
