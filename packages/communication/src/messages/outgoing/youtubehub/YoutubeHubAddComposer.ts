import { IMessageComposer } from '@octane/api';

/** BobbaTok (9819) : ajoute une video a la playlist (proprio / droits). */
export class YoutubeHubAddComposer implements IMessageComposer<ConstructorParameters<typeof YoutubeHubAddComposer>>
{
    private _data: ConstructorParameters<typeof YoutubeHubAddComposer>;

    constructor(videoId: string, title: string, channel: string, duration: number)
    {
        this._data = [ videoId, title, channel, duration ];
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
