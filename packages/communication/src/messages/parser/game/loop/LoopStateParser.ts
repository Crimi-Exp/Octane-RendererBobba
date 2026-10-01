import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Etat d'une voiture Bobba Loop. */
export interface ILoopCarState
{
    /** 0 sur la piste, 1 en l'air, 2 accident, 3 arrivee */
    mode: number;
    x: number;
    y: number;
    /** angle de la voiture (radians, 0 = vers la droite, positif = nez vers le bas) */
    angle: number;
    vx: number;
    vy: number;
    /** position sur la piste (index de point) */
    s: number;
    /** nitro 0 a 1 */
    nitro: number;
    /** 1 nitro, 2 booster, 4 gaz */
    flags: number;
    place: number;
    finishMs: number;
    left: boolean;
    crashMs: number;
}

/** Etat Bobba Loop : phase (0 compte a rebours, 1 course), ms restantes, voitures, evenements [type, a, b, c, d]. */
export class LoopStateParser implements IMessageParser
{
    private _phase: number;
    private _timeLeftMs: number;
    private _cars: ILoopCarState[];
    private _events: number[][];

    public flush(): boolean
    {
        this._phase = 0;
        this._timeLeftMs = 0;
        this._cars = [];
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
            const v: number[] = [];
            for(let j = 0; j < length; j++) v.push(wrapper.readInt());
            this._cars.push({
                mode: v[0] ?? 0,
                x: (v[1] ?? 0) / 10,
                y: (v[2] ?? 0) / 10,
                angle: (v[3] ?? 0) / 1000,
                vx: (v[4] ?? 0) / 10,
                vy: (v[5] ?? 0) / 10,
                s: (v[6] ?? 0) / 10,
                nitro: (v[7] ?? 0) / 1000,
                flags: v[8] ?? 0,
                place: v[9] ?? 0,
                finishMs: v[10] ?? -1,
                left: (v[11] ?? 0) === 1,
                crashMs: v[12] ?? 0
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
    public get cars(): ILoopCarState[]
    {
        return this._cars;
    }
    public get events(): number[][]
    {
        return this._events;
    }
}
