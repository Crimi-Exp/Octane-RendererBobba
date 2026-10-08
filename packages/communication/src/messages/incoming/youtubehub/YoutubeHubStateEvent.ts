import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { YoutubeHubStateMessageParser } from '../../parser';

export class YoutubeHubStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, YoutubeHubStateMessageParser);
    }

    public getParser(): YoutubeHubStateMessageParser
    {
        return this.parser as YoutubeHubStateMessageParser;
    }
}
