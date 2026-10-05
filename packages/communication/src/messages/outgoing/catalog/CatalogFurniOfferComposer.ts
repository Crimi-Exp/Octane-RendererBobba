import { IMessageComposer } from '@octane/api';

/**
 * Recherche du catalogue : demande l'offre qui vend ce mobi (type s/i, id du furnidata, classname). Le serveur
 * repond par ProductOfferEvent, comme pour GetProductOfferComposer, mais retrouve l'offre par le mobi lui-meme au
 * lieu du numero d'offre du furnidata (souvent faux sur un retro).
 */
export class CatalogFurniOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogFurniOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogFurniOfferComposer>;

    constructor(furniType: string, furniId: number, className: string)
    {
        this._data = [furniType, furniId, className];
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
