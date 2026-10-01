import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { FastFoodGameStartParser } from '../../../parser';

export class FastFoodGameStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FastFoodGameStartParser);
    }

    public getParser(): FastFoodGameStartParser
    {
        return this.parser as FastFoodGameStartParser;
    }
}
