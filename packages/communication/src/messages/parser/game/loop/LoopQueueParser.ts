import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** File Bobba Loop : statut (0 = hors file, 1 = en attente), joueurs en file, places, secondes avant le depart. */
export class LoopQueueParser implements IMessageParser
{
    private _status: number;
    private _count: number;
    private _max: number;
    private _secondsLeft: number;

    public flush(): boolean
    {
        this._status = 0;
        this._count = 0;
        this._max = 0;
        this._secondsLeft = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._status = wrapper.readInt();
        this._count = wrapper.readInt();
        this._max = wrapper.readInt();
        this._secondsLeft = wrapper.readInt();

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
}
