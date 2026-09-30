import { IMessageComposer } from '@octane/api';

/** BattleBall : utiliser le pouvoir tenu. */
export class BattleBallPowerComposer implements IMessageComposer<ConstructorParameters<typeof BattleBallPowerComposer>>
{
    private _data: ConstructorParameters<typeof BattleBallPowerComposer>;

    constructor()
    {
        this._data = [] as ConstructorParameters<typeof BattleBallPowerComposer>;
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
