import { IMessageComposer } from '@octane/api';

/** Bobba Royale : rejoindre la file (mode 0) ou jouer contre les bots (mode 1), avec le nombre de joueurs (0 = reglage) et l'arme. */
export class RoyaleJoinComposer implements IMessageComposer<ConstructorParameters<typeof RoyaleJoinComposer>>
{
    private _data: ConstructorParameters<typeof RoyaleJoinComposer>;

    constructor(mode: number, players: number, weapon: number = 0)
    {
        this._data = [mode, players, weapon] as unknown as ConstructorParameters<typeof RoyaleJoinComposer>;
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
