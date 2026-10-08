import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { YoutubeHubRoomsMessageParser } from '../../parser';

export class YoutubeHubRoomsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, YoutubeHubRoomsMessageParser);
    }

    public getParser(): YoutubeHubRoomsMessageParser
    {
        return this.parser as YoutubeHubRoomsMessageParser;
    }
}
