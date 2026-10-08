import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IYoutubeHubVideo
{
    videoId: string;
    title: string;
    channel: string;
    duration: number;
}

/** BobbaTok (9825) : string query, int count, count x (string videoId, string title, string channel, int duration). */
export class YoutubeHubSearchResultsMessageParser implements IMessageParser
{
    private static readonly MAX_RESULTS = 100;

    private _query: string;
    private _videos: IYoutubeHubVideo[];

    public flush(): boolean
    {
        this._query = '';
        this._videos = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._query = wrapper.readString();

        const count = wrapper.readInt();

        if((count < 0) || (count > YoutubeHubSearchResultsMessageParser.MAX_RESULTS)) return false;

        for(let index = 0; index < count; index++)
        {
            const videoId = wrapper.readString();
            const title = wrapper.readString();
            const channel = wrapper.readString();
            const duration = wrapper.readInt();

            this._videos.push({ videoId, title, channel, duration });
        }

        return true;
    }

    public get query(): string { return this._query; }
    public get videos(): IYoutubeHubVideo[] { return this._videos; }
}
