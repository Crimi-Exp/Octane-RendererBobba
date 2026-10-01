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
    /** bits : 1 cache pour toi, 2 dans un buisson, 4 levitation, 8 bouclier, 16 vitesse, 32 invisible */
    flags: number;
    /** cubes de puissance */
    cubes: number;
    maxHp: number;
}

export interface IRoyaleObject
{
    id: number;
    /** 1 trousse, 2 bombe a ramasser, 3 bombe lancee, 4 levitation, 5 bouclier, 6 vitesse, 7 invisibilite, 8 cube */
    kind: number;
    x: number;
    y: number;
}

/**
 * Etat d'une partie de Bobba Royale (a chaque changement, au moins toutes les secondes). La zone suivante est
 * annoncee (centre, rayon) avec l'etat de la zone (0 attente, 1 retrecit, 2 derniere) et le temps restant de
 * cet etat. Evenements [type, a, b, c, d, e] : 1 tir (tireur, cible, touche, x, y), 2 mort (victime, tueur,
 * place, x, y), 3 ramassage (joueur, sorte, x, y, vie ou bombes), 4 zone (joueur, vie), 5 bombe lancee
 * (lanceur, x, y, meche ms, id), 6 explosion (lanceur, x, y, joueurs touches, id), 7 emote (joueur, emote),
 * 8 caisse cassee (0, x, y).
 */
export class RoyaleStateParser implements IMessageParser
{
    private _phase: number;
    private _timeLeftMs: number;
    private _alive: number;
    private _zoneX: number;
    private _zoneY: number;
    private _zoneRadius: number;
    private _nextX: number;
    private _nextY: number;
    private _nextRadius: number;
    private _zoneState: number;
    private _zoneMsLeft: number;
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
        this._nextX = 0;
        this._nextY = 0;
        this._nextRadius = 0;
        this._zoneState = 0;
        this._zoneMsLeft = 0;
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
        this._nextX = wrapper.readInt() / 100;
        this._nextY = wrapper.readInt() / 100;
        this._nextRadius = wrapper.readInt() / 100;
        this._zoneState = wrapper.readInt();
        this._zoneMsLeft = wrapper.readInt();

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
                bombs: wrapper.readInt(),
                flags: wrapper.readInt(),
                cubes: wrapper.readInt(),
                maxHp: wrapper.readInt()
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
    public get nextX(): number
    {
        return this._nextX;
    }
    public get nextY(): number
    {
        return this._nextY;
    }
    public get nextRadius(): number
    {
        return this._nextRadius;
    }
    public get zoneState(): number
    {
        return this._zoneState;
    }
    public get zoneMsLeft(): number
    {
        return this._zoneMsLeft;
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
