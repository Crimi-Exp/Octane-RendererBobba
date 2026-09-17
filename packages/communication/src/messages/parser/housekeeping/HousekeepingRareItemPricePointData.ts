import { IMessageDataWrapper } from '@octane/api';

export class HousekeepingRareItemPricePointData
{
    private _diamondValue: number = 0;
    private _changedAt: number = 0;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this._diamondValue = wrapper.readInt();
        this._changedAt = wrapper.readInt();
    }

    public get diamondValue(): number
    {
        return this._diamondValue;
    }
    public get changedAt(): number
    {
        return this._changedAt;
    }
}