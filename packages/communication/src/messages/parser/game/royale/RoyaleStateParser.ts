import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IRoyalePlayerState
{
    x: number;
    y: number;
    dir: number;
    hp: number;
    alive: boolean;
    /** joueur vise, -1 aucun */
    target: number;
    kills: number;
    left: boolean;
    /** bombes en poche */
    bombs: number;
}

export interface IRoyaleObject
{
    id: number;
    /** 1 trousse de soin, 2 bombe a ramasser, 3 bombe lancee (meche allumee) */
    kind: number;
    x: number;
    y: number;
}

/**
 * Etat d'une partie de Bobba Royale (a chaque changement, au moins toutes les secondes). Evenements
 * [type, a, b, c, d, e] : 1 tir (tireur, cible, touche, x, y), 2 mort (victime, tueur, place, x, y),
 * 3 ramassage (joueur, sorte, x, y, vie ou bombes), 4 zone (joueur, vie), 5 bombe lancee (lanceur, x, y,
 * meche ms, id), 6 explosion (lanceur, x, y, joueurs touches, id).
 */
export class RoyaleStateParser implements IMessageParser
{
    private _phase: number;
    private _timeLeftMs: number;
    private _alive: number;
    private _zoneX: number;
    private _zoneY: number;
    private _zoneRadius: number;
    private _players: IRoyalePlayerState[];
    private _objects: IRoyaleObject[];
    private _events: number[][];

    public flush(): boolean
    {
        this._phase = 0;
        this._timeLeftMs = 0;
        this._alive = 0;
        this._zoneX = 0;
        this._zoneY = 0;
        this._zoneRadius = 0;
        this._players = [];
        this._objects = [];
        this._events = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._phase = wrapper.readInt();
        this._timeLeftMs = wrapper.readInt();
        this._alive = wrapper.readInt();
        this._zoneX = wrapper.readInt() / 100;
        this._zoneY = wrapper.readInt() / 100;
        this._zoneRadius = wrapper.readInt() / 100;

        let count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._players.push({
                x: wrapper.readInt(),
                y: wrapper.readInt(),
                dir: wrapper.readInt(),
                hp: wrapper.readInt(),
                alive: wrapper.readInt() !== 0,
                target: wrapper.readInt(),
                kills: wrapper.readInt(),
                left: wrapper.readInt() !== 0,
                bombs: wrapper.readInt()
            });
        }

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._objects.push({
                id: wrapper.readInt(),
                kind: wrapper.readInt(),
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
    public get alive(): number
    {
        return this._alive;
    }
    public get zoneX(): number
    {
        return this._zoneX;
    }
    public get zoneY(): number
    {
        return this._zoneY;
    }
    public get zoneRadius(): number
    {
        return this._zoneRadius;
    }
    public get players(): IRoyalePlayerState[]
    {
        return this._players;
    }
    public get objects(): IRoyaleObject[]
    {
        return this._objects;
    }
    public get events(): number[][]
    {
        return this._events;
    }
}
