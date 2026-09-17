import { IMessageComposer } from '@octane/api';

/** BobbaTok Reward Track: claim the reward at {@code points} on the free or HC track (custom header 9491). */
export class RewardTrackClaimComposer implements IMessageComposer<ConstructorParameters<typeof RewardTrackClaimComposer>>
{
    private _data: ConstructorParameters<typeof RewardTrackClaimComposer>;

    constructor(points: number, hc: boolean)
    {
        this._data = [ points, hc ];
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
