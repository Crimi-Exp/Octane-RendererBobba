import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UnoTableParser } from '../../../parser';

export class UnoTableEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UnoTableParser);
    }

    public getParser(): UnoTableParser
    {
        return this.parser as UnoTableParser;
    }
}
