import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Fin de partie : equipe gagnante (-1 = egalite), scores, points gagnes et totaux du joueur. */
export class BattleBallGameEndParser implements IMessageParser
{
    private _left: boolean;
    private _winnerTeam: number;
    private _teamScores: number[];
    private _playerScores: number[];
    private _points: number;
    private _games: number;
    private _wins: number;
    private _totalPoints: number;

    public flush(): boolean
    {
        this._left = false;
        this._winnerTeam = -1;
        this._teamScores = [];
        this._playerScores = [];
        this._points = 0;
        this._games = 0;
        this._wins = 0;
        this._totalPoints = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._left = wrapper.readInt() !== 0;
        this._winnerTeam = wrapper.readInt();
        let count = wrapper.readInt();
        for(let i = 0; i < count; i++) this._teamScores.push(wrapper.readInt());
        count = wrapper.readInt();
        for(let i = 0; i < count; i++) this._playerScores.push(wrapper.readInt());
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
    public get winnerTeam(): number
    {
        return this._winnerTeam;
    }
    public get teamScores(): number[]
    {
        return this._teamScores;
    }
    public get playerScores(): number[]
    {
        return this._playerScores;
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
