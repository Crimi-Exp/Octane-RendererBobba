import { IMessageComposer } from '@octane/api';

/** BobbaTok (9811) : ajoute (true) ou retire (false) une offre des favoris. Reponse : CATALOG_FAVORITES. */
export class ToggleCatalogFavoriteComposer implements IMessageComposer<ConstructorParameters<typeof ToggleCatalogFavoriteComposer>>
{
    private _data: ConstructorParameters<typeof ToggleCatalogFavoriteComposer>;

    constructor(offerId: number, favorite: boolean)
    {
        this._data = [ offerId, favorite ];
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
