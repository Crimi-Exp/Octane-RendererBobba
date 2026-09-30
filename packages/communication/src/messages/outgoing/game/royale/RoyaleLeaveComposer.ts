import { IMessageComposer } from '@octane/api';

/** Bobba Royale : quitter la file ou la partie. */
export class RoyaleLeaveComposer implements IMessageComposer<ConstructorParameters<typeof RoyaleLeaveComposer>>
{
    private _data: ConstructorParameters<typeof RoyaleLeaveComposer>;

    constructor()
    {
        this._data = [] as ConstructorParameters<typeof RoyaleLeaveComposer>;
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
