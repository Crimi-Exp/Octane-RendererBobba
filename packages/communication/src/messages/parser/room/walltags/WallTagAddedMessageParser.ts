import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { WallTagData } from './WallTagData';

export class WallTagAddedMessageParser implements IMessageParser
{
    private _tag: WallTagData;
    private _animate: boolean;

    public flush(): boolean
    {
        this._tag = null;
        this._animate = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._tag = new WallTagData(wrapper);
        this._animate = wrapper.readBoolean();

        return true;
    }

    public get tag(): WallTagData
    {
        return this._tag;
    }

    public get animate(): boolean
    {
        return this._animate;
    }
}
