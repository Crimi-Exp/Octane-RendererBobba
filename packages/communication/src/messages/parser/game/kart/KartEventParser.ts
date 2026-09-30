import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Evenement de course : 1 objet ramasse, 2 objet utilise, 3 touche, 4 nouveau tour, 5 arrivee, 6 choc. */
export class KartEventParser implements IMessageParser
{
    private _type: number;
    private _racer: number;
    private _value: number;

    public flush(): boolean
    {
        this._type = 0;
        this._racer = 0;
        this._value = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._type = wrapper.readInt();
        this._racer = wrapper.readInt();
        this._value = wrapper.readInt();

        return true;
    }

    public get type(): number
    {
        return this._type;
    }
    public get racer(): number
    {
        return this._racer;
    }
    public get value(): number
    {
        return this._value;
    }
}
