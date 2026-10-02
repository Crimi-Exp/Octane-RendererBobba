import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Un mobi demande par la mission de l'etage suivant. */
export interface IBrainrotRequirement
{
    itemName: string;
    rarity: number;
    owned: boolean;
}

/**
 * Brainrot, pour toi : l'appart, tes pieces, ton gain par seconde, l'argent a ramasser, ta base (-1 = aucune), tes
 * etages, ton verrou (ms restantes, ms avant de pouvoir refermer) et la mission de l'etage suivant (0 = aucune).
 */
export class BrainrotStateParser implements IMessageParser
{
    private _roomId: number;
    private _coins: number;
    private _income: number;
    private _pending: number;
    private _base: number;
    private _floors: number;
    private _maxFloors: number;
    private _lockMs: number;
    private _cooldownMs: number;
    private _nextLevel: number;
    private _price: number;
    private _requirements: IBrainrotRequirement[];
    private _lockExtraMs: number;
    private _lockExtraPrice: number;
    private _freezePrice: number;
    private _hitReadyMs: number;
    private _freezeReadyMs: number;

    public flush(): boolean
    {
        this._roomId = 0;
        this._coins = 0;
        this._income = 0;
        this._pending = 0;
        this._base = -1;
        this._floors = 1;
        this._maxFloors = 1;
        this._lockMs = 0;
        this._cooldownMs = 0;
        this._nextLevel = 0;
        this._price = 0;
        this._requirements = [];
        this._lockExtraMs = 0;
        this._lockExtraPrice = 0;
        this._freezePrice = 0;
        this._hitReadyMs = 0;
        this._freezeReadyMs = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._roomId = wrapper.readInt();
        this._coins = Number(wrapper.readString()) || 0;
        this._income = Number(wrapper.readString()) || 0;
        this._pending = Number(wrapper.readString()) || 0;
        this._base = wrapper.readInt();
        this._floors = wrapper.readInt();
        this._maxFloors = wrapper.readInt();
        this._lockMs = wrapper.readInt();
        this._cooldownMs = wrapper.readInt();
        this._nextLevel = wrapper.readInt();
        this._price = Number(wrapper.readString()) || 0;

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const itemName = wrapper.readString();
            const rarity = wrapper.readInt();
            const owned = wrapper.readInt() === 1;
            this._requirements.push({ itemName, rarity, owned });
        }

        this._lockExtraMs = wrapper.readInt();
        this._lockExtraPrice = Number(wrapper.readString()) || 0;
        this._freezePrice = Number(wrapper.readString()) || 0;
        this._hitReadyMs = wrapper.readInt();
        this._freezeReadyMs = wrapper.readInt();

        return true;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
    public get coins(): number
    {
        return this._coins;
    }
    public get income(): number
    {
        return this._income;
    }
    public get pending(): number
    {
        return this._pending;
    }
    public get base(): number
    {
        return this._base;
    }
    public get floors(): number
    {
        return this._floors;
    }
    public get maxFloors(): number
    {
        return this._maxFloors;
    }
    public get lockMs(): number
    {
        return this._lockMs;
    }
    public get cooldownMs(): number
    {
        return this._cooldownMs;
    }
    public get nextLevel(): number
    {
        return this._nextLevel;
    }
    public get price(): number
    {
        return this._price;
    }
    public get requirements(): IBrainrotRequirement[]
    {
        return this._requirements;
    }
    public get lockExtraMs(): number
    {
        return this._lockExtraMs;
    }
    public get lockExtraPrice(): number
    {
        return this._lockExtraPrice;
    }
    public get freezePrice(): number
    {
        return this._freezePrice;
    }
    public get hitReadyMs(): number
    {
        return this._hitReadyMs;
    }
    public get freezeReadyMs(): number
    {
        return this._freezeReadyMs;
    }
}
