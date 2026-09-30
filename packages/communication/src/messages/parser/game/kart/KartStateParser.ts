import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IKartRacerState
{
    x: number;
    y: number;
    heading: number;
    speed: number;
    lap: number;
    place: number;
    item: number;
    /** 1 tete-a-queue, 2 champignon, 4 etoile, 8 arrive, 16 dans l'herbe, 32 parti */
    flags: number;
    finishPlace: number;
}

export interface IKartObjectState
{
    /** 1 banane, 2 carapace verte */
    type: number;
    id: number;
    x: number;
    y: number;
}

/** Etat de la course, 20 fois par seconde. */
export class KartStateParser implements IMessageParser
{
    private _timeMs: number;
    private _racers: IKartRacerState[];
    private _boxMask: number;
    private _objects: IKartObjectState[];

    public flush(): boolean
    {
        this._timeMs = 0;
        this._racers = [];
        this._boxMask = 0;
        this._objects = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._timeMs = wrapper.readInt();

        let count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._racers.push({
                x: wrapper.readInt() / 1000,
                y: wrapper.readInt() / 1000,
                heading: wrapper.readInt() / 1000,
                speed: wrapper.readInt() / 1000,
                lap: wrapper.readInt(),
                place: wrapper.readInt(),
                item: wrapper.readInt(),
                flags: wrapper.readInt(),
                finishPlace: wrapper.readInt()
            });
        }

        this._boxMask = wrapper.readInt();

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._objects.push({
                type: wrapper.readInt(),
                id: wrapper.readInt(),
                x: wrapper.readInt() / 1000,
                y: wrapper.readInt() / 1000
            });
        }

        return true;
    }

    public get timeMs(): number
    {
        return this._timeMs;
    }
    public get racers(): IKartRacerState[]
    {
        return this._racers;
    }
    public get boxMask(): number
    {
        return this._boxMask;
    }
    public get objects(): IKartObjectState[]
    {
        return this._objects;
    }
}
