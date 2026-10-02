import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Brainrot, pour toi : l'appart, tes pieces, ton gain par seconde, l'argent a ramasser, ta base (-1 = aucune). */
export class BrainrotStateParser implements IMessageParser
{
    private _roomId: number;
    private _coins: number;
    private _income: number;
    private _pending: number;
    private _base: number;

    public flush(): boolean
    {
        this._roomId = 0;
        this._coins = 0;
        this._income = 0;
        this._pending = 0;
        this._base = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._roomId = wrapper.readInt();
        this._coins = Number(wrapper.readString()) || 0;
        this._income = Number(wrapper.readString()) || 0;
        this._pending = Number(wrapper.readString()) || 0;
        this._base = wrapper.readInt();

        return true;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
    public get coins(): number
    {
        return this._coins;
    }
    public get income(): number
    {
        return this._income;
    }
    public get pending(): number
    {
        return this._pending;
    }
    public get base(): number
    {
        return this._base;
    }
}
