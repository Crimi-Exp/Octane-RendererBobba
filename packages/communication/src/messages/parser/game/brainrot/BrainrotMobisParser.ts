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
    /** tapis : progression du mobi a l'envoi (ms), temps par case (negatif = tapis arrete), derniere case */
    ageMs: number;
    stepMs: number;
    endX: number;
    /** porte : id de l'avatar qui le porte */
    unitId: number;
    /** socle : son etage (le client n'en affiche qu'un a la fois par base) */
    floor: number;
    /** version ultra : 0 aucune, 1 or, 2 diamant, 3 arc-en-ciel */
    mutation: number;
    /** porte : c'est un mobi vole */
    stolen: boolean;
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
            const floor = wrapper.readInt();
            const mutation = wrapper.readInt();
            const stolen = wrapper.readInt() === 1;
            this._mobis.push({ id, kind, itemName, rarity, value, ownerId, x, y, z, rotation, ageMs, stepMs, endX, unitId, floor, mutation, stolen });
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
