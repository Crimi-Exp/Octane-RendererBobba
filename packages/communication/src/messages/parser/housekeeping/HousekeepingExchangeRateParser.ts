import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export class HousekeepingExchangeRateParser implements IMessageParser
{
    private _diamondsPerToken: number = 0;

    public flush(): boolean
    {
        this._diamondsPerToken = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._diamondsPerToken = wrapper.readInt();

        return true;
    }

    public get diamondsPerToken(): number
    {
        return this._diamondsPerToken;
    }
}