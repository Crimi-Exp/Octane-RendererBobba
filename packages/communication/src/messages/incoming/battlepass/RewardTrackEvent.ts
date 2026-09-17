import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RewardTrackParser } from '../../parser';

export class RewardTrackEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RewardTrackParser);
    }

    public getParser(): RewardTrackParser
    {
        return this.parser as RewardTrackParser;
    }
}
