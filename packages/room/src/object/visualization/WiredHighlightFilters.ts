import { WiredFilter, WiredOutlineFilter } from '@octane/utils';
import { Filter } from 'pixi.js';

/**
 * Filtres de surbrillance wf_act_set_highlight, partages par couleur : un mobi recolore son contour noir et
 * prend une teinte ; un avatar recoit un contour autour de sa silhouette et une teinte.
 */
export class WiredHighlightFilters
{
    private static _furniture: Map<number, WiredFilter> = new Map();
    private static _avatar: Map<number, WiredOutlineFilter> = new Map();

    /** Couleur 0xRRGGBB valide, ou -1 (eteinte) pour toute autre valeur. */
    public static normalizeColor(value: unknown): number
    {
        if((typeof value !== 'number') || !isFinite(value) || (value < 0)) return -1;

        return (Math.floor(value) & 0xFFFFFF);
    }

    public static furniture(color: number): WiredFilter
    {
        color = WiredHighlightFilters.normalizeColor(color);

        if(color < 0) return null;

        let filter = WiredHighlightFilters._furniture.get(color);

        if(!filter)
        {
            filter = new WiredFilter({ lineColor: color, color });

            WiredHighlightFilters._furniture.set(color, filter);
        }

        return filter;
    }

    public static avatar(color: number): WiredOutlineFilter
    {
        color = WiredHighlightFilters.normalizeColor(color);

        if(color < 0) return null;

        let filter = WiredHighlightFilters._avatar.get(color);

        if(!filter)
        {
            filter = new WiredOutlineFilter({ color });

            WiredHighlightFilters._avatar.set(color, filter);
        }

        return filter;
    }

    /** Remplace la surbrillance d'une liste de filtres, sans toucher aux autres (selection wired, chooser...). */
    public static withHighlight(filters: readonly Filter[] | null | undefined, highlight: Filter | null): Filter[]
    {
        const kept = (filters || []).filter(filter => !WiredHighlightFilters.isHighlightFilter(filter));

        return highlight ? [ highlight, ...kept ] : kept;
    }

    public static isHighlightFilter(filter: Filter): boolean
    {
        if(!filter) return false;

        for(const known of WiredHighlightFilters._furniture.values()) if(known === filter) return true;
        for(const known of WiredHighlightFilters._avatar.values()) if(known === filter) return true;

        return false;
    }
}
