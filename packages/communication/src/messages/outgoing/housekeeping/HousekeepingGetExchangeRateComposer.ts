import { IMessageComposer } from '@octane/api';

export class HousekeepingGetExchangeRateComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingGetExchangeRateComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingGetExchangeRateComposer>;

    constructor()
    {
        this._data = [];
    }

    public getMessageArray()
    {
        return this._data;
    }
    public dispose(): void
    {
        return;
    }
}