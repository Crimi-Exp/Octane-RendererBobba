import { IMessageComposer } from '@octane/api';

export class HousekeepingAddRareItemComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingAddRareItemComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingAddRareItemComposer>;

    constructor(itemId: number, rarityTier: string, diamondValue: number)
    {
        this._data = [itemId, rarityTier, diamondValue];
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