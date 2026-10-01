import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { LoopQueueParser } from '../../../parser';

export class LoopQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, LoopQueueParser);
    }

    public getParser(): LoopQueueParser
    {
        return this.parser as LoopQueueParser;
    }
}
