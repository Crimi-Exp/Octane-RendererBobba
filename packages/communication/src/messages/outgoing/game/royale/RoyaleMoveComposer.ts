import { IMessageComposer } from '@octane/api';

/** Bobba Royale : aller sur une case. */
export class RoyaleMoveComposer implements IMessageComposer<ConstructorParameters<typeof RoyaleMoveComposer>>
{
    private _data: ConstructorParameters<typeof RoyaleMoveComposer>;

    constructor(x: number, y: number)
    {
        this._data = [x, y] as ConstructorParameters<typeof RoyaleMoveComposer>;
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
