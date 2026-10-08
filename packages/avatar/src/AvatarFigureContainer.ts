import { IAvatarFigureContainer, IAvatarFigurePartLayer } from '@octane/api';

/* BobbaTok : une meme categorie peut apparaitre plusieurs fois dans la tenue (vetements superposes),
   ex. "hr-100-61.hr-515-45". La premiere occurrence reste la piece "principale" (toutes les API
   historiques la voient seule) ; les suivantes sont des couches dessinees par-dessus, dans l'ordre. */
export class AvatarFigureContainer implements IAvatarFigureContainer
{
    private _parts: Map<string, Map<string, any>>;
    private _layers: Map<string, IAvatarFigurePartLayer[]>;

    constructor(figure: string)
    {
        this._parts = new Map();
        this._layers = new Map();

        this.parseFigure(figure);
    }

    public getPartTypeIds(): IterableIterator<string>
    {
        return this.partSets().keys();
    }

    public hasPartType(partType: string): boolean
    {
        return !!this.partSets().get(partType);
    }

    public getPartSetId(partType: string): number
    {
        const existing = this.partSets().get(partType);

        if(!existing) return 0;

        return existing.get('setid');
    }

    public getPartColorIds(partType: string): number[]
    {
        const existing = this.partSets().get(partType);

        if(!existing) return [];

        return (existing.get('colorids') ?? []);
    }

    public getPartLayers(partType: string): IAvatarFigurePartLayer[]
    {
        return (this._layers?.get(partType) ?? []);
    }

    public updatePart(setType: string, partSetId: number, colorIds: number[]): void
    {
        const set: Map<string, any> = new Map();

        set.set('type', setType);
        set.set('setid', partSetId);
        set.set('colorids', colorIds);

        const existingSets = this.partSets();

        existingSets.delete(setType);
        existingSets.set(setType, set);
    }

    public addPartLayer(setType: string, partSetId: number, colorIds: number[]): void
    {
        if(!this.hasPartType(setType))
        {
            this.updatePart(setType, partSetId, colorIds);

            return;
        }

        if(!this._layers) this._layers = new Map();

        const layers = this._layers.get(setType) ?? [];

        layers.push({ setId: partSetId, colorIds });

        this._layers.set(setType, layers);
    }

    public removePart(partType: string): void
    {
        this.partSets().delete(partType);
        this._layers?.delete(partType);
    }

    public getFigureString(): string
    {
        const parts: string[] = [];

        for(const key of this.partSets().keys())
        {
            if(!key) continue;

            let setParts = [];

            setParts.push(key);
            setParts.push(this.getPartSetId(key));

            setParts = setParts.concat(this.getPartColorIds(key));

            parts.push(setParts.join('-'));

            for(const layer of this.getPartLayers(key)) parts.push([ key, layer.setId, ...layer.colorIds ].join('-'));
        }

        return parts.join('.');
    }

    private partSets(): Map<string, Map<string, any>>
    {
        if(!this._parts) this._parts = new Map();

        return this._parts;
    }

    private parseFigure(figure: string): void
    {
        if(!figure) figure = '';

        for(const part of figure.split('.'))
        {
            const pieces = part.split('-');

            if(pieces.length >= 2)
            {
                const type = pieces[0];
                const setId = parseInt(pieces[1]);
                const colors = [];

                let index = 2;

                while(index < pieces.length)
                {
                    colors.push(parseInt(pieces[index]));

                    index++;
                }

                if(this.hasPartType(type)) this.addPartLayer(type, setId, colors);
                else this.updatePart(type, setId, colors);
            }
        }
    }
}
