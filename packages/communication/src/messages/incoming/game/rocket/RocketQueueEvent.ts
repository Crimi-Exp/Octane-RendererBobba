import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RocketQueueParser } from '../../../parser';

export class RocketQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RocketQueueParser);
    }

    public getParser(): RocketQueueParser
    {
        return this.parser as RocketQueueParser;
    }
}
