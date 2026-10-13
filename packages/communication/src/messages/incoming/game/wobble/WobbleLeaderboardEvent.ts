import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleLeaderboardParser } from '../../../parser';

export class WobbleLeaderboardEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleLeaderboardParser);
    }

    public getParser(): WobbleLeaderboardParser
    {
        return this.parser as WobbleLeaderboardParser;
    }
}
