import { IMessageComposer } from '@octane/api';

/** UNO : rejoindre la file (mode 0) ou jouer tout de suite contre des bots (mode 1, nombre de bots). */
export class UnoJoinComposer implements IMessageComposer<ConstructorParameters<typeof UnoJoinComposer>>
{
    private _data: ConstructorParameters<typeof UnoJoinComposer>;

    constructor(mode: number, bots: number)
    {
        this._data = [mode, bots] as unknown as ConstructorParameters<typeof UnoJoinComposer>;
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
