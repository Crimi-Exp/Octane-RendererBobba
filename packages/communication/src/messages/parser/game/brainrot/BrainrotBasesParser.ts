import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IBrainrotBase
{
    index: number;
    ownerId: number;
    ownerName: string;
    gateItemId: number;
    collectItemId: number;
    pending: number;
}

/** Brainrot : les 8 bases de l'appart (proprietaire, porte, dalle a collecter, argent qui attend). */
export class BrainrotBasesParser implements IMessageParser
{
    private _bases: IBrainrotBase[];

    public flush(): boolean
    {
        this._bases = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const index = wrapper.readInt();
            const ownerId = wrapper.readInt();
            const ownerName = wrapper.readString();
            const gateItemId = wrapper.readInt();
            const collectItemId = wrapper.readInt();
            const pending = Number(wrapper.readString()) || 0;
            this._bases.push({ index, ownerId, ownerName, gateItemId, collectItemId, pending });
        }

        return true;
    }

    public get bases(): IBrainrotBase[]
    {
        return this._bases;
    }
}
