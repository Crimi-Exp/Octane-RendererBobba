// BobbaTok : reglage d'affichage d'un mobi empile, choisi dans l'outil Architecte (rubrique « Affichage »).
// Le serveur l'envoie a l'entree dans l'appart et a chaque changement (paquet 10566, lu par le client), le client le
// range ici, et le tri des mobis (RoomSpriteCanvas) le lit avant la regle automatique (restsInsideSeat).

/** 0 = auto, 1 = « dans le mobi du dessous » (tri par calques), 2 = « par-dessus » (tri par hauteur) */
export const FURNI_SORT_AUTO = 0;
export const FURNI_SORT_INSIDE = 1;
export const FURNI_SORT_ON_TOP = 2;

const overrides: Map<number, number> = new Map();
let version = 0;

/** numero qui change a chaque modification : le tri de l'appart est refait quand il bouge */
export const getFurniSortVersion = (): number => version;

export const getFurniSortOverride = (itemId: number): number => (overrides.get(itemId) ?? FURNI_SORT_AUTO);

/**
 * @param full true = etat complet de l'appart (entree) : les reglages d'avant sont oublies
 * @param entries [ itemId, mode ]
 */
export const setFurniSortOverrides = (full: boolean, entries: ReadonlyArray<readonly [ number, number ]>): void =>
{
    if(full) overrides.clear();

    for(const [ itemId, mode ] of entries)
    {
        if(!(itemId > 0)) continue;

        if((mode === FURNI_SORT_INSIDE) || (mode === FURNI_SORT_ON_TOP)) overrides.set(itemId, mode);
        else overrides.delete(itemId);
    }

    version++;
};
