import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UnoGameStartParser } from '../../../parser';

export class UnoGameStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UnoGameStartParser);
    }

    public getParser(): UnoGameStartParser
    {
        return this.parser as UnoGameStartParser;
    }
}
