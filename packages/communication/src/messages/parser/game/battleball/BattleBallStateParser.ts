import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IBattleBallPlayerState
{
    x: number;
    y: number;
    dir: number;
    /** 0 normal, 1 etourdi, 2 balle crevee, 3 ressort, 4 perceuse, 5 arlequin adverse, 6 canon */
    state: number;
    stateMs: number;
    power: number;
    powerMs: number;
    harlequinTeam: number;
    score: number;
    left: boolean;
}

/** Case changee : couleur (-2 neutre, -1 vierge, 0 a 3 equipe), etat (0 a 4 scellee), remplissage. */
export interface IBattleBallTileUpdate
{
    x: number;
    y: number;
    colour: number;
    state: number;
    fill: boolean;
}

export interface IBattleBallObject
{
    id: number;
    /** 1 pouvoir, 2 clou */
    kind: number;
    type: number;
    x: number;
    y: number;
}

/** Etat de la partie, a chaque saut (toutes les 500 ms) et a chaque pouvoir. */
export class BattleBallStateParser implements IMessageParser
{
    private _phase: number;
    private _timeLeftMs: number;
    private _step: number;
    private _players: IBattleBallPlayerState[];
    private _teamScores: number[];
    private _tiles: IBattleBallTileUpdate[];
    private _objects: IBattleBallObject[];
    private _events: number[][];

    public flush(): boolean
    {
        this._phase = 0;
        this._timeLeftMs = 0;
        this._step = 0;
        this._players = [];
        this._teamScores = [];
        this._tiles = [];
        this._objects = [];
        this._events = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._phase = wrapper.readInt();
        this._timeLeftMs = wrapper.readInt();
        this._step = wrapper.readInt();

        let count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._players.push({
                x: wrapper.readInt(),
                y: wrapper.readInt(),
                dir: wrapper.readInt(),
                state: wrapper.readInt(),
                stateMs: wrapper.readInt(),
                power: wrapper.readInt(),
                powerMs: wrapper.readInt(),
                harlequinTeam: wrapper.readInt(),
                score: wrapper.readInt(),
                left: wrapper.readInt() !== 0
            });
        }

        count = wrapper.readInt();
        for(let i = 0; i < count; i++) this._teamScores.push(wrapper.readInt());

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._tiles.push({
                x: wrapper.readInt(),
                y: wrapper.readInt(),
                colour: wrapper.readInt(),
                state: wrapper.readInt(),
                fill: wrapper.readInt() !== 0
            });
        }

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._objects.push({
                id: wrapper.readInt(),
                kind: wrapper.readInt(),
                type: wrapper.readInt(),
                x: wrapper.readInt(),
                y: wrapper.readInt()
            });
        }

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const event: number[] = [];
            for(let j = 0; j < 6; j++) event.push(wrapper.readInt());
            this._events.push(event);
        }

        return true;
    }

    public get phase(): number
    {
        return this._phase;
    }
    public get timeLeftMs(): number
    {
        return this._timeLeftMs;
    }
    public get step(): number
    {
        return this._step;
    }
    public get players(): IBattleBallPlayerState[]
    {
        return this._players;
    }
    public get teamScores(): number[]
    {
        return this._teamScores;
    }
    public get tiles(): IBattleBallTileUpdate[]
    {
        return this._tiles;
    }
    public get objects(): IBattleBallObject[]
    {
        return this._objects;
    }
    /** [type, joueur, a, b, c, d] : 1 ramasse, 2 pouvoir, 3 canon, 4 clou, 5 etourdi */
    public get events(): number[][]
    {
        return this._events;
    }
}
