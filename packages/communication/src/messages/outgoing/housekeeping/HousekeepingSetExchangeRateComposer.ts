import { IMessageComposer } from '@octane/api';

export class HousekeepingSetExchangeRateComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingSetExchangeRateComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingSetExchangeRateComposer>;

    constructor(diamondsPerToken: number)
    {
        this._data = [diamondsPerToken];
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