import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredHighlightParser } from '../../parser';

export class WiredHighlightEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredHighlightParser);
    }

    public getParser(): WiredHighlightParser
    {
        return this.parser as WiredHighlightParser;
    }
}
