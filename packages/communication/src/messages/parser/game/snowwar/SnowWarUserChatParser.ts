import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export class SnowWarUserChatParser implements IMessageParser
{
    private _objectId: number;
    private _message: string;
    private _styleId: number;

    public flush(): boolean
    {
        this._objectId = -1;
        this._message = '';
        this._styleId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._objectId = wrapper.readInt();
        this._message = wrapper.readString();
        // BobbaTok : style de bulle choisi dans la barre de tchat (absent chez un serveur officiel)
        this._styleId = wrapper.bytesAvailable ? wrapper.readInt() : 0;

        return true;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get message(): string
    {
        return this._message;
    }

    public get styleId(): number
    {
        return this._styleId;
    }
}
