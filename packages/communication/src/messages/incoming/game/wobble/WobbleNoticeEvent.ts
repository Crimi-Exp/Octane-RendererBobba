import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleNoticeParser } from '../../../parser';

export class WobbleNoticeEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleNoticeParser);
    }

    public getParser(): WobbleNoticeParser
    {
        return this.parser as WobbleNoticeParser;
    }
}
