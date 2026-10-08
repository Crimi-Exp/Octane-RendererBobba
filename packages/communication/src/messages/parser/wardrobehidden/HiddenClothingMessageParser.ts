import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IHiddenClothingEntry
{
    setType: string;
    partId: number;
}

/** BobbaTok (9815) : int count, puis count x (string categorie, int id de piece). */
export class HiddenClothingMessageParser implements IMessageParser
{
    private static readonly MAX_ENTRIES = 10000;

    private _entries: IHiddenClothingEntry[];

    public flush(): boolean
    {
        this._entries = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();

        if((count < 0) || (count > HiddenClothingMessageParser.MAX_ENTRIES)) return false;

        for(let index = 0; index < count; index++)
        {
            const setType = wrapper.readString();
            const partId = wrapper.readInt();

            this._entries.push({ setType, partId });
        }

        return true;
    }

    public get entries(): IHiddenClothingEntry[]
    {
        return this._entries;
    }
}
