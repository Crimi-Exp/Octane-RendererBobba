import { IMessageComposer } from '@octane/api';

/** Rocket Bobba : quitter la file ou le match. */
export class RocketLeaveComposer implements IMessageComposer<ConstructorParameters<typeof RocketLeaveComposer>>
{
    private _data: ConstructorParameters<typeof RocketLeaveComposer>;

    constructor()
    {
        this._data = [] as ConstructorParameters<typeof RocketLeaveComposer>;
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
