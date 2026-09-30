import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** File BattleBall : statut (0 = hors file, 1 = en attente), joueurs en file, places, secondes, equipes, arene. */
export class BattleBallQueueParser implements IMessageParser
{
    private _status: number;
    private _count: number;
    private _max: number;
    private _secondsLeft: number;
    private _teams: number;
    private _arena: number;

    public flush(): boolean
    {
        this._status = 0;
        this._count = 0;
        this._max = 0;
        this._secondsLeft = 0;
        this._teams = 0;
        this._arena = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._status = wrapper.readInt();
        this._count = wrapper.readInt();
        this._max = wrapper.readInt();
        this._secondsLeft = wrapper.readInt();
        this._teams = wrapper.readInt();
        this._arena = wrapper.readInt();

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
    public get teams(): number
    {
        return this._teams;
    }
    public get arena(): number
    {
        return this._arena;
    }
}
