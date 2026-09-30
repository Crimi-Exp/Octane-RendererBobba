import { IMessageComposer } from '@octane/api';

/** Bobba Royale : aller sur une case, ou y lancer une bombe (throwBomb). */
export class RoyaleMoveComposer implements IMessageComposer<ConstructorParameters<typeof RoyaleMoveComposer>>
{
    private _data: ConstructorParameters<typeof RoyaleMoveComposer>;

    constructor(x: number, y: number, throwBomb: boolean = false)
    {
        this._data = [x, y, throwBomb ? 1 : 0] as unknown as ConstructorParameters<typeof RoyaleMoveComposer>;
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
