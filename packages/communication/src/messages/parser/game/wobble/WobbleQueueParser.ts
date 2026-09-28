import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Etat de la file : status 0 = hors file, 1 = en file. */
export class WobbleQueueParser implements IMessageParser
{
    private _status: number;
    private _position: number;
    private _size: number;

    public flush(): boolean
    {
        this._status = 0;
        this._position = 0;
        this._size = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._status = wrapper.readInt();
        this._position = wrapper.readInt();
        this._size = wrapper.readInt();

        return true;
    }

    public get status(): number
    {
        return this._status;
    }

    public get position(): number
    {
        return this._position;
    }

    public get size(): number
    {
        return this._size;
    }
}
