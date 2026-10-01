import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UnoGameEndParser } from '../../../parser';

export class UnoGameEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UnoGameEndParser);
    }

    public getParser(): UnoGameEndParser
    {
        return this.parser as UnoGameEndParser;
    }
}
