import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Bulle de chat d'un joueur pendant le duel (side = camp de celui qui parle). */
export class WobbleChatParser implements IMessageParser
{
    private _side: number;
    private _message: string;

    public flush(): boolean
    {
        this._side = 0;
        this._message = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._side = wrapper.readInt();
        this._message = wrapper.readString();

        return true;
    }

    public get side(): number { return this._side; }
    public get message(): string { return this._message; }
}
