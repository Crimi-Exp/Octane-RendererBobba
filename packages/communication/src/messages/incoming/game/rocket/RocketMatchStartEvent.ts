import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RocketMatchStartParser } from '../../../parser';

export class RocketMatchStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RocketMatchStartParser);
    }

    public getParser(): RocketMatchStartParser
    {
        return this.parser as RocketMatchStartParser;
    }
}
