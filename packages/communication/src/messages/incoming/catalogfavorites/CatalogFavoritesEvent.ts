import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { CatalogFavoritesMessageParser } from '../../parser';

export class CatalogFavoritesEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CatalogFavoritesMessageParser);
    }

    public getParser(): CatalogFavoritesMessageParser
    {
        return this.parser as CatalogFavoritesMessageParser;
    }
}
