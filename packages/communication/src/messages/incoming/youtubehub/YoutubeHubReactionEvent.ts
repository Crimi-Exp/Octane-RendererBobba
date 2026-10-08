import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { YoutubeHubReactionMessageParser } from '../../parser';

export class YoutubeHubReactionEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, YoutubeHubReactionMessageParser);
    }

    public getParser(): YoutubeHubReactionMessageParser
    {
        return this.parser as YoutubeHubReactionMessageParser;
    }
}
