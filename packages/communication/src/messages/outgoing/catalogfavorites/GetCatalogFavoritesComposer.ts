import { IMessageComposer } from '@octane/api';

/** BobbaTok (9810) : demande la liste des offres favorites du catalogue. Reponse : CATALOG_FAVORITES. */
export class GetCatalogFavoritesComposer implements IMessageComposer<[]>
{
    public getMessageArray(): []
    {
        return [];
    }

    public dispose(): void
    {
        return;
    }
}
