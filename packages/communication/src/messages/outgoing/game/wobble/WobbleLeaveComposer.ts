import { IMessageComposer } from '@octane/api';

/** Quitter la file ou abandonner le duel en cours. */
export class WobbleLeaveComposer implements IMessageComposer<ConstructorParameters<typeof WobbleLeaveComposer>>
{
    private _data: ConstructorParameters<typeof WobbleLeaveComposer>;

    constructor()
    {
        this._data = [] as ConstructorParameters<typeof WobbleLeaveComposer>;
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
