import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RoyaleGameEndParser } from '../../../parser';

export class RoyaleGameEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoyaleGameEndParser);
    }

    public getParser(): RoyaleGameEndParser
    {
        return this.parser as RoyaleGameEndParser;
    }
}
