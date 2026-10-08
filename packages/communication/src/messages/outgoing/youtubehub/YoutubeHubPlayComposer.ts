import { IMessageComposer } from '@octane/api';

/** BobbaTok (9821) : joue une entree (-1 = suivante). */
export class YoutubeHubPlayComposer implements IMessageComposer<ConstructorParameters<typeof YoutubeHubPlayComposer>>
{
    private _data: ConstructorParameters<typeof YoutubeHubPlayComposer>;

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
