import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Fin de manche : camp tombe (-1 = aucun ou les deux) et manches gagnees. */
export class WobbleRoundEndParser implements IMessageParser
{
    private _loserSide: number;
    private _winsA: number;
    private _winsB: number;

    public flush(): boolean
    {
        this._loserSide = 0;
        this._winsA = 0;
        this._winsB = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._loserSide = wrapper.readInt();
        this._winsA = wrapper.readInt();
        this._winsB = wrapper.readInt();

        return true;
    }

    public get loserSide(): number
    {
        return this._loserSide;
    }

    public get winsA(): number
    {
        return this._winsA;
    }

    public get winsB(): number
    {
        return this._winsB;
    }
}
