import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IBrainrotBase
{
    index: number;
    ownerId: number;
    ownerName: string;
    gateItemId: number;
    collectItemId: number;
    pending: number;
    /** coin, taille en cases, porte vers le bas (bases du haut) ou vers le haut */
    x: number;
    y: number;
    width: number;
    depth: number;
    doorDown: boolean;
    /** etages debloques par son proprietaire, hauteur d'un etage */
    floors: number;
    floorHeight: number;
    /** verrou : ms restantes (0 = ouverte) */
    lockMs: number;
}

/** Brainrot : les 8 bases de l'appart (proprietaire, porte, dalle a collecter, argent qui attend, place, etages, verrou). */
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
            const x = wrapper.readInt();
            const y = wrapper.readInt();
            const width = wrapper.readInt();
            const depth = wrapper.readInt();
            const doorDown = wrapper.readInt() === 1;
            const floors = wrapper.readInt();
            const floorHeight = wrapper.readInt() / 100;
            const lockMs = wrapper.readInt();
            this._bases.push({ index, ownerId, ownerName, gateItemId, collectItemId, pending, x, y, width, depth, doorDown, floors, floorHeight, lockMs });
        }

        return true;
    }

    public get bases(): IBrainrotBase[]
    {
        return this._bases;
    }
}
