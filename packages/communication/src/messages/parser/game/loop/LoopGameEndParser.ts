import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Fin Bobba Loop : parti ou non, gagnant (-1 = personne), place / temps (ms, -1 = pas arrive) / accidents / saltos
 * de chaque voiture, points gagnes, puis tes totaux (courses, victoires, saltos, points).
 */
export class LoopGameEndParser implements IMessageParser
{
    private _left: boolean;
    private _winner: number;
    private _places: number[];
    private _times: number[];
    private _crashes: number[];
    private _flips: number[];
    private _points: number;
    private _totalGames: number;
    private _totalWins: number;
    private _totalFlips: number;
    private _totalPoints: number;

    public flush(): boolean
    {
        this._left = false;
        this._winner = -1;
        this._places = [];
        this._times = [];
        this._crashes = [];
        this._flips = [];
        this._points = 0;
        this._totalGames = 0;
        this._totalWins = 0;
        this._totalFlips = 0;
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
            this._places.push(wrapper.readInt());
            this._times.push(wrapper.readInt());
            this._crashes.push(wrapper.readInt());
            this._flips.push(wrapper.readInt());
        }
        this._points = wrapper.readInt();
        this._totalGames = wrapper.readInt();
        this._totalWins = wrapper.readInt();
        this._totalFlips = wrapper.readInt();
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
    public get times(): number[]
    {
        return this._times;
    }
    public get crashes(): number[]
    {
        return this._crashes;
    }
    public get flips(): number[]
    {
        return this._flips;
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
    public get totalFlips(): number
    {
        return this._totalFlips;
    }
    public get totalPoints(): number
    {
        return this._totalPoints;
    }
}
