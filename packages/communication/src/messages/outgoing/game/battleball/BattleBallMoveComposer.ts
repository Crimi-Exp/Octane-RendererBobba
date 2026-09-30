import { IMessageComposer } from '@octane/api';

/** BattleBall : aller sur une case. */
export class BattleBallMoveComposer implements IMessageComposer<ConstructorParameters<typeof BattleBallMoveComposer>>
{
    private _data: ConstructorParameters<typeof BattleBallMoveComposer>;

    constructor(x: number, y: number)
    {
        this._data = [x, y] as ConstructorParameters<typeof BattleBallMoveComposer>;
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
