import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** BobbaTok (9812) : int pageIdFavoris, int count, int[count] offerIds. */
export class CatalogFavoritesMessageParser implements IMessageParser
{
    private static readonly MAX_ENTRIES = 5000;

    private _favoritesPageId: number;
    private _offerIds: number[];

    public flush(): boolean
    {
        this._favoritesPageId = 0;
        this._offerIds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._favoritesPageId = wrapper.readInt();

        const count = wrapper.readInt();

        if((count < 0) || (count > CatalogFavoritesMessageParser.MAX_ENTRIES)) return false;

        for(let index = 0; index < count; index++) this._offerIds.push(wrapper.readInt());

        return true;
    }

    public get favoritesPageId(): number
    {
        return this._favoritesPageId;
    }

    public get offerIds(): number[]
    {
        return this._offerIds;
    }
}
