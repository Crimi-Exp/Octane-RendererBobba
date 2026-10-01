import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { FastFoodQueueParser } from '../../../parser';

export class FastFoodQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FastFoodQueueParser);
    }

    public getParser(): FastFoodQueueParser
    {
        return this.parser as FastFoodQueueParser;
    }
}
