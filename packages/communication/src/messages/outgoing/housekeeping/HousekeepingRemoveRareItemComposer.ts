import { IMessageComposer } from '@octane/api';

export class HousekeepingRemoveRareItemComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingRemoveRareItemComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingRemoveRareItemComposer>;

    constructor(itemId: number)
    {
        this._data = [itemId];
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