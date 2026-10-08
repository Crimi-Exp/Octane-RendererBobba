import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { YoutubeHubSearchResultsMessageParser } from '../../parser';

export class YoutubeHubSearchResultsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, YoutubeHubSearchResultsMessageParser);
    }

    public getParser(): YoutubeHubSearchResultsMessageParser
    {
        return this.parser as YoutubeHubSearchResultsMessageParser;
    }
}
