import { IMessageComposer } from '@octane/api';

/** Bobba Royale : aller sur une case ; mode 1 (ou true) y lance une bombe, mode 2 fait l'emote x. */
export class RoyaleMoveComposer implements IMessageComposer<ConstructorParameters<typeof RoyaleMoveComposer>>
{
    private _data: ConstructorParameters<typeof RoyaleMoveComposer>;

    constructor(x: number, y: number, mode: number | boolean = 0)
    {
        this._data = [x, y, (mode === true) ? 1 : (Number(mode) || 0)] as unknown as ConstructorParameters<typeof RoyaleMoveComposer>;
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
