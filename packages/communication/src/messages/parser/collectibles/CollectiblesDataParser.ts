import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Collectibles : une sorte de donnees ("overview", "shop", "result") et son contenu en JSON. */
export class CollectiblesDataParser implements IMessageParser
{
    private _kind: string;
    private _json: string;

    public flush(): boolean
    {
        this._kind = '';
        this._json = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._kind = wrapper.readString();
        this._json = wrapper.readString();

        return true;
    }

    public get kind(): string
    {
        return this._kind;
    }

    public get json(): string
    {
        return this._json;
    }
}
