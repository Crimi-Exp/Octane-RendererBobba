import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Fin d'une partie de Bobba Royale : gagnant, place et victimes de chacun, points et totaux du joueur. */
export class RoyaleGameEndParser implements IMessageParser
{
    private _left: boolean;
    private _winner: number;
    private _places: number[];
    private _kills: number[];
    private _points: number;
    private _totalGames: number;
    private _totalWins: number;
    private _totalKills: number;
    private _totalPoints: number;

    public flush(): boolean
    {
        this._left = false;
        this._winner = -1;
        this._places = [];
        this._kills = [];
        this._points = 0;
        this._totalGames = 0;
        this._totalWins = 0;
        this._totalKills = 0;
        this._totalPoints = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._left = wrapper.readInt() !== 0;
        this._winner = wrapper.readInt();
        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._places.push(wrapper.readInt());
            this._kills.push(wrapper.readInt());
        }
        this._points = wrapper.readInt();
        this._totalGames = wrapper.readInt();
        this._totalWins = wrapper.readInt();
        this._totalKills = wrapper.readInt();
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
    public get places(): number[]
    {
        return this._places;
    }
    public get kills(): number[]
    {
        return this._kills;
    }
    public get points(): number
    {
        return this._points;
    }
    public get totalGames(): number
    {
        return this._totalGames;
    }
    public get totalWins(): number
    {
        return this._totalWins;
    }
    public get totalKills(): number
    {
        return this._totalKills;
    }
    public get totalPoints(): number
    {
        return this._totalPoints;
    }
}
