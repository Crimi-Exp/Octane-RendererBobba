import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { HousekeepingExchangeRateParser } from '../../parser';

export class HousekeepingExchangeRateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, HousekeepingExchangeRateParser);
    }

    public getParser(): HousekeepingExchangeRateParser
    {
        return this.parser as HousekeepingExchangeRateParser;
    }
}