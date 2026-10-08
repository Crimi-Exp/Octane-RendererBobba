import { IMessageComposer } from '@octane/api';

/** BobbaTok (9822) : like (true) / dislike (false), re-cliquer annule. */
export class YoutubeHubVoteComposer implements IMessageComposer<ConstructorParameters<typeof YoutubeHubVoteComposer>>
{
    private _data: ConstructorParameters<typeof YoutubeHubVoteComposer>;

    constructor(like: boolean)
    {
        this._data = [ like ];
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
