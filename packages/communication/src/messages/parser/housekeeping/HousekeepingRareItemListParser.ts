import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { HousekeepingRareItemSummaryData } from './HousekeepingRareItemSummaryData';

export class HousekeepingRareItemListParser implements IMessageParser
{
    private _items: HousekeepingRareItemSummaryData[] = [];

    public flush(): boolean
    {
        this._items = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();

        for(let i = 0; i < count; i++) this._items.push(new HousekeepingRareItemSummaryData(wrapper));

        return true;
    }

    public get items(): HousekeepingRareItemSummaryData[]
    {
        return this._items;
    }
}