import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RoyaleQueueParser } from '../../../parser';

export class RoyaleQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoyaleQueueParser);
    }

    public getParser(): RoyaleQueueParser
    {
        return this.parser as RoyaleQueueParser;
    }
}
