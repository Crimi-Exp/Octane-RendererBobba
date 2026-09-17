import { IMessageComposer } from '@octane/api';

export class HousekeepingListRareItemsComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingListRareItemsComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingListRareItemsComposer>;

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