import { IMessageComposer } from '@octane/api';

/** BattleBall : rejoindre la file (mode 0) ou jouer contre les bots (mode 1), nombre d'equipes (2 a 4), arene (0 = au hasard). */
export class BattleBallJoinComposer implements IMessageComposer<ConstructorParameters<typeof BattleBallJoinComposer>>
{
    private _data: ConstructorParameters<typeof BattleBallJoinComposer>;

    constructor(mode: number, teams: number, arena: number)
    {
        this._data = [mode, teams, arena] as ConstructorParameters<typeof BattleBallJoinComposer>;
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
