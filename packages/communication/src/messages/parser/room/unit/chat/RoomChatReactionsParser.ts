import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** BobbaTok : compteurs de reactions d'un message de tchat (messageId + [index, compteur]...). */
export class RoomChatReactionsParser implements IMessageParser
{
    private _messageId: number;
    private _counts: number[];

    public flush(): boolean
    {
        this._messageId = 0;
        this._counts = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._messageId = wrapper.readInt();
        this._counts = [];

        const total = wrapper.readInt();

        for(let i = 0; i < total; i++)
        {
            const index = wrapper.readInt();
            const count = wrapper.readInt();

            this._counts[index] = count;
        }

        return true;
    }

    public get messageId(): number
    {
        return this._messageId;
    }

    public get counts(): number[]
    {
        return this._counts;
    }
}
