import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RoyaleStateParser } from '../../../parser';

export class RoyaleStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoyaleStateParser);
    }

    public getParser(): RoyaleStateParser
    {
        return this.parser as RoyaleStateParser;
    }
}
