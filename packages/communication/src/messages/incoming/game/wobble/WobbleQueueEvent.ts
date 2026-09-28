import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleQueueParser } from '../../../parser';

export class WobbleQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleQueueParser);
    }

    public getParser(): WobbleQueueParser
    {
        return this.parser as WobbleQueueParser;
    }
}
