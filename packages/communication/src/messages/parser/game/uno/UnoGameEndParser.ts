import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IUnoResult
{
    cards: number;
    points: number;
    played: number;
}

/** Fin UNO : parti ou non, gagnant, chaque joueur (cartes restees, leur valeur, cartes posees), tes points et tes totaux. */
export class UnoGameEndParser implements IMessageParser
{
    private _left: boolean;
    private _winner: number;
    private _results: IUnoResult[];
    private _points: number;
    private _games: number;
    private _wins: number;
    private _totalPoints: number;

    public flush(): boolean
    {
        this._left = false;
        this._winner = -1;
        this._results = [];
        this._points = 0;
        this._games = 0;
        this._wins = 0;
        this._totalPoints = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._left = wrapper.readInt() === 1;
        this._winner = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const cards = wrapper.readInt();
            const points = wrapper.readInt();
            const played = wrapper.readInt();
            this._results.push({ cards, points, played });
        }

        this._points = wrapper.readInt();
        this._games = wrapper.readInt();
        this._wins = wrapper.readInt();
        this._totalPoints = wrapper.readInt();

        return true;
    }

    public get left(): boolean
    {
        return this._left;
    }
    public get winner(): number
    {
        return this._winner;
    }
    public get results(): IUnoResult[]
    {
        return this._results;
    }
    public get points(): number
    {
        return this._points;
    }
    public get games(): number
    {
        return this._games;
    }
    public get wins(): number
    {
        return this._wins;
    }
    public get totalPoints(): number
    {
        return this._totalPoints;
    }
}
