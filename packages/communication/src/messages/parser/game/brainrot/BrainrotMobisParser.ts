import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IBrainrotMobi
{
    /** id dans le jeu (le client en fait un mobi local a id negatif) */
    id: number;
    /** 0 sur le tapis, 1 sur un socle, 2 porte par un joueur, -1 retire */
    kind: number;
    /** nom du mobi dans le furnidata */
    itemName: string;
    rarity: number;
    /** prix (tapis) ou gain par seconde (socle, porte) */
    value: number;
    ownerId: number;
    x: number;
    y: number;
    /** hauteur (pour un mobi porte : au-dessus des pieds de l'avatar) */
    z: number;
    rotation: number;
    /** tapis : age du mobi a l'envoi, temps par case, derniere case */
    ageMs: number;
    stepMs: number;
    endX: number;
    /** porte : id de l'avatar qui le porte */
    unitId: number;
}

/** Brainrot : les mobis du jeu, dessines par le client (liste complete ou mise a jour). */
export class BrainrotMobisParser implements IMessageParser
{
    private _full: boolean;
    private _mobis: IBrainrotMobi[];

    public flush(): boolean
    {
        this._full = false;
        this._mobis = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._full = wrapper.readInt() === 1;

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const id = wrapper.readInt();
            const kind = wrapper.readInt();
            const itemName = wrapper.readString();
            const rarity = wrapper.readInt();
            const value = wrapper.readInt();
            const ownerId = wrapper.readInt();
            const x = wrapper.readInt();
            const y = wrapper.readInt();
            const z = wrapper.readInt() / 100;
            const rotation = wrapper.readInt();
            const ageMs = wrapper.readInt();
            const stepMs = wrapper.readInt();
            const endX = wrapper.readInt();
            const unitId = wrapper.readInt();
            this._mobis.push({ id, kind, itemName, rarity, value, ownerId, x, y, z, rotation, ageMs, stepMs, endX, unitId });
        }

        return true;
    }

    public get full(): boolean
    {
        return this._full;
    }

    public get mobis(): IBrainrotMobi[]
    {
        return this._mobis;
    }
}
