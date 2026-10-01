import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Etat d'un joueur FastFood : son plat en cours, ses plats servis et ses pouvoirs. */
export interface IFastFoodPlayerState
{
    /** 0 rien, 1 minuteur, 2 pret, 3 chute, 4 parachute, 5 servi, 6 casse, 7 explose */
    dish: number;
    /** ms passees dans cet etat */
    stateMs: number;
    /** hauteur : 0 plateau, 1000 table */
    y: number;
    /** vitesse (unites / s) */
    v: number;
    /** plat 0 a 4 (a, b, c, d, e) */
    food: number;
    dishId: number;
    /** duree du minuteur (ms) */
    prepMs: number;
    stars: number;
    rockets: number;
    bigs: number;
    shields: number;
    /** 1 bouclier, 2 grand parachute arme, 4 grand parachute ouvert */
    flags: number;
    left: boolean;
    place: number;
    /** parachute ouvert trop tard : le plat va s'ecraser */
    doomed: boolean;
}

/** Etat FastFood : phase (0 compte a rebours, 1 jeu), ms restantes, joueurs, evenements [type, a, b, c, d]. */
export class FastFoodStateParser implements IMessageParser
{
    private _phase: number;
    private _timeLeftMs: number;
    private _players: IFastFoodPlayerState[];
    private _events: number[][];

    public flush(): boolean
    {
        this._phase = 0;
        this._timeLeftMs = 0;
        this._players = [];
        this._events = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._phase = wrapper.readInt();
        this._timeLeftMs = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const length = wrapper.readInt();
            const values: number[] = [];
            for(let j = 0; j < length; j++) values.push(wrapper.readInt());
            this._players.push({
                dish: values[0] ?? 0,
                stateMs: values[1] ?? 0,
                y: values[2] ?? 0,
                v: values[3] ?? 0,
                food: values[4] ?? 0,
                dishId: values[5] ?? -1,
                prepMs: values[6] ?? 0,
                stars: values[7] ?? 0,
                rockets: values[8] ?? 0,
                bigs: values[9] ?? 0,
                shields: values[10] ?? 0,
                flags: values[11] ?? 0,
                left: (values[12] ?? 0) === 1,
                place: values[13] ?? 0,
                doomed: (values[14] ?? 0) === 1
            });
        }

        const events = wrapper.readInt();
        for(let i = 0; i < events; i++)
        {
            const event: number[] = [];
            for(let j = 0; j < 5; j++) event.push(wrapper.readInt());
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
    public get players(): IFastFoodPlayerState[]
    {
        return this._players;
    }
    public get events(): number[][]
    {
        return this._events;
    }
}
