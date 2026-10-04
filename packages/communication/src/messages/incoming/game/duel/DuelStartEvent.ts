import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { DuelStartParser } from '../../../parser';

export class DuelStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, DuelStartParser);
    }

    public getParser(): DuelStartParser
    {
        return this.parser as DuelStartParser;
    }
}
