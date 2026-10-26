import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Rocket Bobba : evenement (1 but, 2 demolition, 3 touche, 4 boost, 5 engagement, 6 prolongation, 7 saut, 8 arret, 9 mur). */
export class RocketEventParser implements IMessageParser
{
    private _type: number;
    private _a: number;
    private _b: number;

    public flush(): boolean
    {
        this._type = 0;
        this._a = 0;
        this._b = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._type = wrapper.readInt();
        this._a = wrapper.readInt();
        this._b = wrapper.readInt();

        return true;
    }

    public get type(): number
    {
        return this._type;
    }
    public get a(): number
    {
        return this._a;
    }
    public get b(): number
    {
        return this._b;
    }
}
