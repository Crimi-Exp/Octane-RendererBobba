import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UnoStateParser } from '../../../parser';

export class UnoStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UnoStateParser);
    }

    public getParser(): UnoStateParser
    {
        return this.parser as UnoStateParser;
    }
}
