import { IMessageComposer } from '@octane/api';

/** BobbaTok (9818) : recherche YouTube. Reponse : YOUTUBE_HUB_SEARCH_RESULTS. */
export class YoutubeHubSearchComposer implements IMessageComposer<ConstructorParameters<typeof YoutubeHubSearchComposer>>
{
    private _data: ConstructorParameters<typeof YoutubeHubSearchComposer>;

    constructor(query: string)
    {
        this._data = [ query ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
