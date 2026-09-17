import { IMessageComposer } from '@octane/api';

export class HousekeepingSetRareItemValueComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingSetRareItemValueComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingSetRareItemValueComposer>;

    constructor(itemId: number, newValue: number)
    {
        this._data = [itemId, newValue];
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