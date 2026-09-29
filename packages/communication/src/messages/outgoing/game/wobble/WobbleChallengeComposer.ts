import { IMessageComposer } from '@octane/api';

/** Defier un joueur connecte par son pseudo. */
export class WobbleChallengeComposer implements IMessageComposer<ConstructorParameters<typeof WobbleChallengeComposer>>
{
    private _data: ConstructorParameters<typeof WobbleChallengeComposer>;

    constructor(username: string)
    {
        this._data = [ username ];
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
