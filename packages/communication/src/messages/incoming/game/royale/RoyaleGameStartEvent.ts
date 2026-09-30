import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RoyaleGameStartParser } from '../../../parser';

export class RoyaleGameStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoyaleGameStartParser);
    }

    public getParser(): RoyaleGameStartParser
    {
        return this.parser as RoyaleGameStartParser;
    }
}
