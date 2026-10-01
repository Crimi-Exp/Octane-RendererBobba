import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UnoOpenParser } from '../../../parser';

export class UnoOpenEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UnoOpenParser);
    }

    public getParser(): UnoOpenParser
    {
        return this.parser as UnoOpenParser;
    }
}
