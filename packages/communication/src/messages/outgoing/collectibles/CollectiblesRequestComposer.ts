import { IMessageComposer } from '@octane/api';

/**
 * Collectibles : "overview" (score et collections), "shop" (boutique NFT), "claim" (bonus de la collection value,
 * 0 = tout), "buy" (acheter l'offre value en emeraudes).
 */
export class CollectiblesRequestComposer implements IMessageComposer<ConstructorParameters<typeof CollectiblesRequestComposer>>
{
    private _data: ConstructorParameters<typeof CollectiblesRequestComposer>;

    constructor(action: string, value: number = 0)
    {
        this._data = [action, value] as ConstructorParameters<typeof CollectiblesRequestComposer>;
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
