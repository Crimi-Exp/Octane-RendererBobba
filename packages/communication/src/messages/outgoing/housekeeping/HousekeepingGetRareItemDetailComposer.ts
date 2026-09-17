import { IMessageComposer } from '@octane/api';

export class HousekeepingGetRareItemDetailComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingGetRareItemDetailComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingGetRareItemDetailComposer>;

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