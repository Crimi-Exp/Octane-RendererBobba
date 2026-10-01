import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Fin FastFood : parti ou non, gagnant (-1 = personne), place / plats servis / plats casses / missiles reussis de
 * chaque joueur, points gagnes, puis tes totaux (parties, victoires, plats, points).
 */
export class FastFoodGameEndParser implements IMessageParser
{
    private _left: boolean;
    private _winner: number;
    private _places: number[];
    private _stars: number[];
    private _crashes: number[];
    private _hits: number[];
    private _points: number;
    private _totalGames: number;
    private _totalWins: number;
    private _totalDishes: number;
    private _totalPoints: number;

    public flush(): boolean
    {
        this._left = false;
        this._winner = -1;
        this._places = [];
        this._stars = [];
        this._crashes = [];
        this._hits = [];
        this._points = 0;
        this._totalGames = 0;
        this._totalWins = 0;
        this._totalDishes = 0;
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
            this._stars.push(wrapper.readInt());
            this._crashes.push(wrapper.readInt());
            this._hits.push(wrapper.readInt());
        }
        this._points = wrapper.readInt();
        this._totalGames = wrapper.readInt();
        this._totalWins = wrapper.readInt();
        this._totalDishes = wrapper.readInt();
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
    public get stars(): number[]
    {
        return this._stars;
    }
    public get crashes(): number[]
    {
        return this._crashes;
    }
    public get hits(): number[]
    {
        return this._hits;
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
    public get totalDishes(): number
    {
        return this._totalDishes;
    }
    public get totalPoints(): number
    {
        return this._totalPoints;
    }
}
