import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { HousekeepingRareItemDetailParser } from '../../parser';

export class HousekeepingRareItemDetailEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, HousekeepingRareItemDetailParser);
    }

    public getParser(): HousekeepingRareItemDetailParser
    {
        return this.parser as HousekeepingRareItemDetailParser;
    }
}