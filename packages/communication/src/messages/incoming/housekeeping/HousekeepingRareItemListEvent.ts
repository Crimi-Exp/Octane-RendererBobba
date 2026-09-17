import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { HousekeepingRareItemListParser } from '../../parser';

export class HousekeepingRareItemListEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, HousekeepingRareItemListParser);
    }

    public getParser(): HousekeepingRareItemListParser
    {
        return this.parser as HousekeepingRareItemListParser;
    }
}