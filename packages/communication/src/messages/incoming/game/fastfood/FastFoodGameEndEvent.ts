import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { FastFoodGameEndParser } from '../../../parser';

export class FastFoodGameEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FastFoodGameEndParser);
    }

    public getParser(): FastFoodGameEndParser
    {
        return this.parser as FastFoodGameEndParser;
    }
}
