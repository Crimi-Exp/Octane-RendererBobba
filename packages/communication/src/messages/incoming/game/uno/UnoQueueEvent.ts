import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UnoQueueParser } from '../../../parser';

export class UnoQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UnoQueueParser);
    }

    public getParser(): UnoQueueParser
    {
        return this.parser as UnoQueueParser;
    }
}
