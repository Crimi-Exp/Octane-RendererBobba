import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { HousekeepingRareItemOwnerData } from './HousekeepingRareItemOwnerData';
import { HousekeepingRareItemPricePointData } from './HousekeepingRareItemPricePointData';

export class HousekeepingRareItemDetailParser implements IMessageParser
{
    private _found: boolean = false;
    private _itemId: number = 0;
    private _spriteId: number = 0;
    private _rarityTier: string = '';
    private _diamondValue: number = 0;
    private _circulation: number = 0;
    private _economicWeight: number = 0;
    private _hasMonopoly: boolean = false;
    private _monopolyUserId: number = 0;
    private _monopolyUsername: string = '';
    private _monopolyLook: string = '';
    private _owners: HousekeepingRareItemOwnerData[] = [];
    private _priceHistory: HousekeepingRareItemPricePointData[] = [];

    public flush(): boolean
    {
        this._found = false;
        this._itemId = 0;
        this._spriteId = 0;
        this._rarityTier = '';
        this._diamondValue = 0;
        this._circulation = 0;
        this._economicWeight = 0;
        this._hasMonopoly = false;
        this._monopolyUserId = 0;
        this._monopolyUsername = '';
        this._monopolyLook = '';
        this._owners = [];
        this._priceHistory = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._found = wrapper.readBoolean();

        if(!this._found) return true;

        this._itemId = wrapper.readInt();
        this._spriteId = wrapper.readInt();
        this._rarityTier = wrapper.readString();
        this._diamondValue = wrapper.readInt();
        this._circulation = wrapper.readInt();
        this._economicWeight = wrapper.readInt();
        this._hasMonopoly = wrapper.readBoolean();
        this._monopolyUserId = wrapper.readInt();
        this._monopolyUsername = wrapper.readString();
        this._monopolyLook = wrapper.readString();

        const ownerCount = wrapper.readInt();
        for(let i = 0; i < ownerCount; i++) this._owners.push(new HousekeepingRareItemOwnerData(wrapper));

        const priceCount = wrapper.readInt();
        for(let i = 0; i < priceCount; i++) this._priceHistory.push(new HousekeepingRareItemPricePointData(wrapper));

        return true;
    }

    public get found(): boolean
    {
        return this._found;
    }
    public get itemId(): number
    {
        return this._itemId;
    }
    public get spriteId(): number
    {
        return this._spriteId;
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
    public get economicWeight(): number
    {
        return this._economicWeight;
    }
    public get hasMonopoly(): boolean
    {
        return this._hasMonopoly;
    }
    public get monopolyUserId(): number
    {
        return this._monopolyUserId;
    }
    public get monopolyUsername(): string
    {
        return this._monopolyUsername;
    }
    public get monopolyLook(): string
    {
        return this._monopolyLook;
    }
    public get owners(): HousekeepingRareItemOwnerData[]
    {
        return this._owners;
    }
    public get priceHistory(): HousekeepingRareItemPricePointData[]
    {
        return this._priceHistory;
    }
}