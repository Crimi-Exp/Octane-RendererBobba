import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IKartStanding
{
    racer: number;
    place: number;
    /** -1 = pas arrive */
    timeMs: number;
    bestLapMs: number;
    points: number;
}

/** Fin de course : classement de tous les pilotes, points gagnes et totaux du joueur. */
export class KartRaceEndParser implements IMessageParser
{
    private _reason: number;
    private _standings: IKartStanding[];
    private _pointsGained: number;
    private _totalRaces: number;
    private _totalWins: number;
    private _totalPoints: number;

    public flush(): boolean
    {
        this._reason = 0;
        this._standings = [];
        this._pointsGained = 0;
        this._totalRaces = 0;
        this._totalWins = 0;
        this._totalPoints = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._reason = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._standings.push({
                racer: wrapper.readInt(),
                place: wrapper.readInt(),
                timeMs: wrapper.readInt(),
                bestLapMs: wrapper.readInt(),
                points: wrapper.readInt()
            });
        }

        this._pointsGained = wrapper.readInt();
        this._totalRaces = wrapper.readInt();
        this._totalWins = wrapper.readInt();
        this._totalPoints = wrapper.readInt();

        return true;
    }

    public get reason(): number
    {
        return this._reason;
    }
    public get standings(): IKartStanding[]
    {
        return this._standings;
    }
    public get pointsGained(): number
    {
        return this._pointsGained;
    }
    public get totalRaces(): number
    {
        return this._totalRaces;
    }
    public get totalWins(): number
    {
        return this._totalWins;
    }
    public get totalPoints(): number
    {
        return this._totalPoints;
    }
}
