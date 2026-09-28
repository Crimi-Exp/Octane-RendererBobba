import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleStateParser } from '../../../parser';

export class WobbleStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleStateParser);
    }

    public getParser(): WobbleStateParser
    {
        return this.parser as WobbleStateParser;
    }
}
