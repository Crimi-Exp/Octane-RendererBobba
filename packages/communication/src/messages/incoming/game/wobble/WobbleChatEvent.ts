import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleChatParser } from '../../../parser';

export class WobbleChatEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleChatParser);
    }

    public getParser(): WobbleChatParser
    {
        return this.parser as WobbleChatParser;
    }
}
