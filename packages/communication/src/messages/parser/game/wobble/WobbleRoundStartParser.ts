import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Debut de manche : numero et duree du compte a rebours. */
export class WobbleRoundStartParser implements IMessageParser
{
    private _round: number;
    private _countdownMs: number;

    public flush(): boolean
    {
        this._round = 0;
        this._countdownMs = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._round = wrapper.readInt();
        this._countdownMs = wrapper.readInt();

        return true;
    }

    public get round(): number
    {
        return this._round;
    }

    public get countdownMs(): number
    {
        return this._countdownMs;
    }
}
