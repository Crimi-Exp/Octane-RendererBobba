import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { FastFoodStateParser } from '../../../parser';

export class FastFoodStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FastFoodStateParser);
    }

    public getParser(): FastFoodStateParser
    {
        return this.parser as FastFoodStateParser;
    }
}
