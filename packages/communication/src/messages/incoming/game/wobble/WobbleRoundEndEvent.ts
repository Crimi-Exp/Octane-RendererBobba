import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleRoundEndParser } from '../../../parser';

export class WobbleRoundEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleRoundEndParser);
    }

    public getParser(): WobbleRoundEndParser
    {
        return this.parser as WobbleRoundEndParser;
    }
}
