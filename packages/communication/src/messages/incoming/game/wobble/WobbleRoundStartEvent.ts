import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleRoundStartParser } from '../../../parser';

export class WobbleRoundStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleRoundStartParser);
    }

    public getParser(): WobbleRoundStartParser
    {
        return this.parser as WobbleRoundStartParser;
    }
}
