import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IBrainrotLabel
{
    itemId: number;
    /** 0 sur le tapis, 1 sur un socle, -1 retire */
    kind: number;
    rarity: number;
    /** prix (tapis) ou gain par seconde (socle) */
    value: number;
    ownerId: number;
}

/** Brainrot : les etiquettes au-dessus des mobis (liste complete ou mise a jour). */
export class BrainrotLabelsParser implements IMessageParser
{
    private _full: boolean;
    private _labels: IBrainrotLabel[];

    public flush(): boolean
    {
        this._full = false;
        this._labels = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._full = wrapper.readInt() === 1;

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const itemId = wrapper.readInt();
            const kind = wrapper.readInt();
            const rarity = wrapper.readInt();
            const value = wrapper.readInt();
            const ownerId = wrapper.readInt();
            this._labels.push({ itemId, kind, rarity, value, ownerId });
        }

        return true;
    }

    public get full(): boolean
    {
        return this._full;
    }
    public get labels(): IBrainrotLabel[]
    {
        return this._labels;
    }
}
