import { IMessageComposer } from '@octane/api';

/** BobbaTok (9820) : retire une entree de la playlist. */
export class YoutubeHubRemoveComposer implements IMessageComposer<ConstructorParameters<typeof YoutubeHubRemoveComposer>>
{
    private _data: ConstructorParameters<typeof YoutubeHubRemoveComposer>;

    constructor(entryId: number)
    {
        this._data = [ entryId ];
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
