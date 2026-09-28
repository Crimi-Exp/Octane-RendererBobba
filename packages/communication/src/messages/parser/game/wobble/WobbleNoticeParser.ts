import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Evenement ponctuel : 1 = coup touche, 2 = coup esquive, 3 = plouf (side = joueur concerne). */
export class WobbleNoticeParser implements IMessageParser
{
    private _type: number;
    private _side: number;

    public flush(): boolean
    {
        this._type = 0;
        this._side = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._type = wrapper.readInt();
        this._side = wrapper.readInt();

        return true;
    }

    public get type(): number
    {
        return this._type;
    }

    public get side(): number
    {
        return this._side;
    }
}
