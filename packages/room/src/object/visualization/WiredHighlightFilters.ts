import { WiredFilter, WiredHighlightEffectFilter, WiredOutlineFilter } from '@octane/utils';
import { Filter, Ticker } from 'pixi.js';

/** Reglages d'une surbrillance wf_act_set_highlight (format Habbo). */
export interface WiredHighlightStyle
{
    color: number;
    type: number;
    /** 0 a 100. */
    strength: number;
    /** 0 fixe, 1 pulsation. */
    animation: number;
    /** 0 instantane, 1 lineaire, 2 debut progressif, 3 fin progressive, 4 debut et fin progressifs. */
    easing: number;
}

interface AnimatedHighlight
{
    filter: WiredHighlightEffectFilter;
    target: number;
    animation: number;
    easing: number;
    startedAt: number;
}

const STYLE_BASE = 0x1000000;
const TRANSITION_MS = 500;
const PULSE_MS = 1000;

/**
 * Filtres de surbrillance wf_act_set_highlight, partages par reglage.
 *
 * La valeur posee sur le modele de l'objet est soit une couleur 0xRRGGBB seule (ancien format : contour noir
 * recolore + teinte), soit couleur + reglages Habbo encodes au-dessus des 24 bits de couleur
 * (type, intensite, animation, transition) : voir {@link WiredHighlightFilters.encode}.
 */
export class WiredHighlightFilters
{
    private static _furniture: Map<number, Filter> = new Map();
    private static _avatar: Map<number, Filter> = new Map();
    private static _underlay: Map<number, Filter> = new Map();
    private static _animated: Set<AnimatedHighlight> = new Set();
    private static _tickerStarted = false;

    /** Couleur + reglages Habbo en une seule valeur (>= 0), ou -1 quand la surbrillance est eteinte. */
    public static encode(style: WiredHighlightStyle): number
    {
        const strength = Math.max(0, Math.min(100, Math.round(style.strength)));

        if(strength <= 0) return -1;

        const type = Math.max(0, Math.min(5, Math.floor(style.type) || 0));
        const animation = (style.animation === 1) ? 1 : 0;
        const easing = Math.max(0, Math.min(4, Math.floor(style.easing) || 0));
        const code = 1 + type + (8 * strength) + (1024 * animation) + (2048 * easing);

        return ((Math.floor(style.color) & 0xFFFFFF) + (code * STYLE_BASE));
    }

    /** Lit une valeur posee sur le modele ; null pour l'ancien format (couleur seule). */
    public static decode(value: number): WiredHighlightStyle
    {
        if(value < STYLE_BASE) return null;

        const code = Math.floor(value / STYLE_BASE) - 1;

        return {
            color: (value % STYLE_BASE),
            type: (code % 8),
            strength: (Math.floor(code / 8) % 128),
            animation: (Math.floor(code / 1024) % 2),
            easing: (Math.floor(code / 2048) % 8)
        };
    }

    /** Valeur valide (>= 0), ou -1 (eteinte) pour toute autre valeur. */
    public static normalizeColor(value: unknown): number
    {
        if((typeof value !== 'number') || !isFinite(value) || (value < 0)) return -1;

        return Math.floor(value);
    }

    /** Contour, lueur douce et aura neon se dessinent autour de la silhouette entiere (calque sous le mobi). */
    public static isOutsideEffect(value: number): boolean
    {
        const style = WiredHighlightFilters.decode(WiredHighlightFilters.normalizeColor(value));

        return !!style && ((style.type === 0) || (style.type === 1) || (style.type === 5));
    }

    /** Filtre pose sur chaque couche du mobi (teinte, eclaircir, assombrir, ancien format) ; null pour les effets autour. */
    public static furniture(value: number): Filter
    {
        if(WiredHighlightFilters.isOutsideEffect(value)) return null;

        return WiredHighlightFilters.create(value, false);
    }

    /** Filtre du calque pose sous le mobi, pour les effets autour de la silhouette ; null sinon. */
    public static furnitureUnderlay(value: number): Filter
    {
        if(!WiredHighlightFilters.isOutsideEffect(value)) return null;

        return WiredHighlightFilters.create(value, true, true);
    }

    public static avatar(value: number): Filter
    {
        return WiredHighlightFilters.create(value, true);
    }

    private static create(value: number, avatar: boolean, knockout: boolean = false): Filter
    {
        value = WiredHighlightFilters.normalizeColor(value);

        if(value < 0) return null;

        const cache = knockout ? WiredHighlightFilters._underlay : (avatar ? WiredHighlightFilters._avatar : WiredHighlightFilters._furniture);
        let filter = cache.get(value);

        if(filter) return filter;

        const style = WiredHighlightFilters.decode(value);

        if(!style)
        {
            filter = avatar ? new WiredOutlineFilter({ color: value }) : new WiredFilter({ lineColor: value, color: value });
        }
        else
        {
            const effect = new WiredHighlightEffectFilter({ type: style.type, color: style.color, strength: 0, outer: avatar, knockout });
            const target = style.strength / 100;

            if((style.animation === 1) || (style.easing > 0))
            {
                WiredHighlightFilters.animate({ filter: effect, target, animation: style.animation, easing: style.easing, startedAt: performance.now() });
            }
            else
            {
                effect.strength = target;
            }

            filter = effect;
        }

        cache.set(value, filter);

        return filter;
    }

    private static animate(animated: AnimatedHighlight): void
    {
        WiredHighlightFilters.step(animated, animated.startedAt);
        WiredHighlightFilters._animated.add(animated);

        if(WiredHighlightFilters._tickerStarted) return;

        WiredHighlightFilters._tickerStarted = true;

        Ticker.shared.add(() =>
        {
            const now = performance.now();

            for(const entry of WiredHighlightFilters._animated)
            {
                if(!WiredHighlightFilters.step(entry, now)) WiredHighlightFilters._animated.delete(entry);
            }
        });
    }

    /** Met a jour l'intensite ; false quand l'animation est terminee. */
    private static step(entry: AnimatedHighlight, now: number): boolean
    {
        const elapsed = Math.max(0, now - entry.startedAt);

        if(entry.animation === 1)
        {
            const phase = (elapsed % PULSE_MS) / PULSE_MS;

            entry.filter.strength = entry.target * ((1 - Math.cos(phase * Math.PI * 2)) / 2);

            return true;
        }

        const progress = Math.min(1, elapsed / TRANSITION_MS);

        entry.filter.strength = entry.target * WiredHighlightFilters.ease(progress, entry.easing);

        return (progress < 1);
    }

    private static ease(t: number, easing: number): number
    {
        switch(easing)
        {
            case 0: return 1;
            case 2: return t * t;
            case 3: return 1 - (1 - t) * (1 - t);
            case 4: return (t < 0.5) ? (2 * t * t) : (1 - Math.pow(-2 * t + 2, 2) / 2);
            default: return t;
        }
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
        for(const known of WiredHighlightFilters._underlay.values()) if(known === filter) return true;

        return false;
    }
}
