export interface IAvatarFigureContainer
{
    getPartTypeIds(): IterableIterator<string>;
    hasPartType(type: string): boolean;
    getPartSetId(type: string): number;
    getPartColorIds(type: string): number[];
    updatePart(type: string, partSetId: number, colorIds: number[]): void;
    removePart(type: string): void;
    getFigureString(): string;
    /** BobbaTok : couches supplementaires d'une meme categorie (vetements superposes), dans l'ordre d'affichage. */
    getPartLayers?(type: string): IAvatarFigurePartLayer[];
}

export interface IAvatarFigurePartLayer
{
    setId: number;
    colorIds: number[];
}
