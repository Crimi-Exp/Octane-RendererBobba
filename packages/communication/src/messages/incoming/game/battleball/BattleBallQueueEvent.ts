import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BattleBallQueueParser } from '../../../parser';

export class BattleBallQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BattleBallQueueParser);
    }

    public getParser(): BattleBallQueueParser
    {
        return this.parser as BattleBallQueueParser;
    }
}
