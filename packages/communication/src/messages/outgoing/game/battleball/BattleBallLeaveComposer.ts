import { IMessageComposer } from '@octane/api';

/** BattleBall : quitter la file ou la partie. */
export class BattleBallLeaveComposer implements IMessageComposer<ConstructorParameters<typeof BattleBallLeaveComposer>>
{
    private _data: ConstructorParameters<typeof BattleBallLeaveComposer>;

    constructor()
    {
        this._data = [] as ConstructorParameters<typeof BattleBallLeaveComposer>;
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
