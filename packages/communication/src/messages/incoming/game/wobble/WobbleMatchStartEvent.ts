import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleMatchStartParser } from '../../../parser';

export class WobbleMatchStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleMatchStartParser);
    }

    public getParser(): WobbleMatchStartParser
    {
        return this.parser as WobbleMatchStartParser;
    }
}
