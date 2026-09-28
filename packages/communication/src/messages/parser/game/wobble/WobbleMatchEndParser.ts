import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Fin du duel : gagnant (-1 = aucun), score, points gagnes, totaux du joueur, raison (0 = normale, 1 = abandon). */
export class WobbleMatchEndParser implements IMessageParser
{
    private _winnerSide: number;
    private _winsA: number;
    private _winsB: number;
    private _pointsGained: number;
    private _totalWins: number;
    private _totalPoints: number;
    private _reason: number;

    public flush(): boolean
    {
        this._winnerSide = 0;
        this._winsA = 0;
        this._winsB = 0;
        this._pointsGained = 0;
        this._totalWins = 0;
        this._totalPoints = 0;
        this._reason = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._winnerSide = wrapper.readInt();
        this._winsA = wrapper.readInt();
        this._winsB = wrapper.readInt();
        this._pointsGained = wrapper.readInt();
        this._totalWins = wrapper.readInt();
        this._totalPoints = wrapper.readInt();
        this._reason = wrapper.readInt();

        return true;
    }

    public get winnerSide(): number
    {
        return this._winnerSide;
    }

    public get winsA(): number
    {
        return this._winsA;
    }

    public get winsB(): number
    {
        return this._winsB;
    }

    public get pointsGained(): number
    {
        return this._pointsGained;
    }

    public get totalWins(): number
    {
        return this._totalWins;
    }

    public get totalPoints(): number
    {
        return this._totalPoints;
    }

    public get reason(): number
    {
        return this._reason;
    }
}
