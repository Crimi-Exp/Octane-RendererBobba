import { IMessageDataWrapper } from '@octane/api';

export class HousekeepingRareItemSummaryData
{
    private _rareItemId: number = 0;
    private _itemId: number = 0;
    private _rarityTier: string = '';
    private _diamondValue: number = 0;
    private _circulation: number = 0;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this._rareItemId = wrapper.readInt();
        this._itemId = wrapper.readInt();
        this._rarityTier = wrapper.readString();
        this._diamondValue = wrapper.readInt();
        this._circulation = wrapper.readInt();
    }

    public get rareItemId(): number
    {
        return this._rareItemId;
    }
    public get itemId(): number
    {
        return this._itemId;
    }
    public get rarityTier(): string
    {
        return this._rarityTier;
    }
    public get diamondValue(): number
    {
        return this._diamondValue;
    }
    public get circulation(): number
    {
        return this._circulation;
    }
}