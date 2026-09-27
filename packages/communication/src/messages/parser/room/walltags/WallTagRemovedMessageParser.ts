import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** tagId = 0 : tous les tags de la piece ont ete effaces. */
export class WallTagRemovedMessageParser implements IMessageParser
{
    private _tagId: number;

    public flush(): boolean
    {
        this._tagId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._tagId = wrapper.readInt();

        return true;
    }

    public get tagId(): number
    {
        return this._tagId;
    }
}
