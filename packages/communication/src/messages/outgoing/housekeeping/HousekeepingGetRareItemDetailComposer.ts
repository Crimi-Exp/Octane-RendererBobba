import { IMessageComposer } from '@octane/api';

export class HousekeepingGetRareItemDetailComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingGetRareItemDetailComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingGetRareItemDetailComposer>;

    /**
     * @param itemId      id items_base (par defaut) ou id furnidata / sprite id si bySpriteId = true
     * @param bySpriteId  true pour l'apercu housekeeping (le serveur convertit en id items_base)
     */
    constructor(itemId: number, bySpriteId: boolean = false)
    {
        this._data = [ itemId, bySpriteId ];
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
