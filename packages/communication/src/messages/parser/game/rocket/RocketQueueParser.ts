import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Rocket Bobba : file d'attente (statut 1 en file, 0 sorti), joueurs, places, secondes avant le depart, taille d'equipe. */
export class RocketQueueParser implements IMessageParser
{
    private _status: number;
    private _count: number;
    private _max: number;
    private _secondsLeft: number;
    private _size: number;

    public flush(): boolean
    {
        this._status = 0;
        this._count = 0;
        this._max = 0;
        this._secondsLeft = 0;
        this._size = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._status = wrapper.readInt();
        this._count = wrapper.readInt();
        this._max = wrapper.readInt();
        this._secondsLeft = wrapper.readInt();
        this._size = wrapper.readInt();

        return true;
    }

    public get status(): number
    {
        return this._status;
    }
    public get count(): number
    {
        return this._count;
    }
    public get max(): number
    {
        return this._max;
    }
    public get secondsLeft(): number
    {
        return this._secondsLeft;
    }
    public get size(): number
    {
        return this._size;
    }
}
