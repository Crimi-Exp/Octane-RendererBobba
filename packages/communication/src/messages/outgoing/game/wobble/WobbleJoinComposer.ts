import { IMessageComposer } from '@octane/api';

/** Rejoindre la file Wobble Squabble (mode 0 = contre un joueur, 1 = entrainement contre l'ordinateur). */
export class WobbleJoinComposer implements IMessageComposer<ConstructorParameters<typeof WobbleJoinComposer>>
{
    private _data: ConstructorParameters<typeof WobbleJoinComposer>;

    constructor(mode: number = 0)
    {
        this._data = [mode] as ConstructorParameters<typeof WobbleJoinComposer>;
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
