import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IRocketResultRow
{
    index: number;
    team: number;
    goals: number;
    saves: number;
    shots: number;
    demos: number;
    score: number;
}

/** Rocket Bobba : fin du match (score, gagnant, homme du match, statistiques, points). */
export class RocketEndParser implements IMessageParser
{
    private _reason: number;
    private _blue: number;
    private _orange: number;
    private _winner: number;
    private _mvp: number;
    private _rows: IRocketResultRow[];
    private _points: number;
    private _matches: number;
    private _wins: number;
    private _goals: number;

    public flush(): boolean
    {
        this._reason = 0;
        this._blue = 0;
        this._orange = 0;
        this._winner = -1;
        this._mvp = -1;
        this._rows = [];
        this._points = 0;
        this._matches = 0;
        this._wins = 0;
        this._goals = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._reason = wrapper.readInt();
        this._blue = wrapper.readInt();
        this._orange = wrapper.readInt();
        this._winner = wrapper.readInt();
        this._mvp = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._rows.push({
                index: wrapper.readInt(),
                team: wrapper.readInt(),
                goals: wrapper.readInt(),
                saves: wrapper.readInt(),
                shots: wrapper.readInt(),
                demos: wrapper.readInt(),
                score: wrapper.readInt()
            });
        }

        this._points = wrapper.readInt();
        this._matches = wrapper.readInt();
        this._wins = wrapper.readInt();
        this._goals = wrapper.readInt();

        return true;
    }

    public get reason(): number
    {
        return this._reason;
    }
    public get blue(): number
    {
        return this._blue;
    }
    public get orange(): number
    {
        return this._orange;
    }
    public get winner(): number
    {
        return this._winner;
    }
    public get mvp(): number
    {
        return this._mvp;
    }
    public get rows(): IRocketResultRow[]
    {
        return this._rows;
    }
    public get points(): number
    {
        return this._points;
    }
    public get matches(): number
    {
        return this._matches;
    }
    public get wins(): number
    {
        return this._wins;
    }
    public get goals(): number
    {
        return this._goals;
    }
}
