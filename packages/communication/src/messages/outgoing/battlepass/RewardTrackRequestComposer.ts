import { IMessageComposer } from '@octane/api';

/** BobbaTok Reward Track: ask the server for the current state (custom header 9492). */
export class RewardTrackRequestComposer implements IMessageComposer<ConstructorParameters<typeof RewardTrackRequestComposer>>
{
    private _data: ConstructorParameters<typeof RewardTrackRequestComposer>;

    constructor()
    {
        this._data = [];
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
