import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { KartQueueParser } from '../../../parser';

export class KartQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, KartQueueParser);
    }

    public getParser(): KartQueueParser
    {
        return this.parser as KartQueueParser;
    }
}
