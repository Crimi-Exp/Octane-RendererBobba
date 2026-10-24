import { IRoomObjectSprite } from '@octane/api';
import { ColorMatrixFilter, Filter } from 'pixi.js';

/**
 * BobbaTok (patch 44) : effets des bots champions (:botlead). Ce ne sont pas des enables : les numeros 9001-9004
 * n'existent pas dans l'effectmap. L'emu les donne au bot comme n'importe quel effet, et ici on les rend par une
 * teinte sur l'avatar (or, argent, bronze) et des etincelles (LeadSparkleAddition), sans sprite a charger.
 */
export class LeadEffects
{
    /** effet = 9000 + jeu * 16 + place (jeu 0 = general, puis kart, snowstorm, uno, battleball, wobble, duel, royale, fastfood) */
    public static readonly BASE = 9000;
    public static readonly MAX = 9200;
    public static readonly GOLD = 9001;
    public static readonly SILVER = 9002;
    public static readonly BRONZE = 9003;
    public static readonly SHINE = 9004;
    /** identifiants des additions (les additions de l'avatar vont de 1 a 8) */
    public static readonly ADDITION_ID = 9;
    public static readonly BUBBLE_ADDITION_ID = 10;
    public static readonly GAMES = [ 'G\u00e9n\u00e9ral', 'Kart', 'SnowStorm', 'UNO', 'BattleBall', 'Wobble', 'Sorciers', 'Royale', 'FastFood', 'RUN' ];

    public static rank(effect: number): number
    {
        return LeadEffects.isLead(effect) ? ((effect - LeadEffects.BASE) % 16) : 0;
    }

    public static gameIndex(effect: number): number
    {
        return LeadEffects.isLead(effect) ? Math.floor((effect - LeadEffects.BASE) / 16) : 0;
    }

    public static gameLabel(effect: number): string
    {
        return LeadEffects.GAMES[LeadEffects.gameIndex(effect)] || '';
    }

    /** teinte selon la place : 1 or, 2 argent, 3 bronze, sinon brillance seule */
    public static tint(effect: number): number
    {
        const rank = LeadEffects.rank(effect);

        return (rank === 1) ? LeadEffects.GOLD : (rank === 2) ? LeadEffects.SILVER : (rank === 3) ? LeadEffects.BRONZE : LeadEffects.SHINE;
    }

    private static _filters: Map<number, ColorMatrixFilter> = new Map();

    public static isLead(effect: number): boolean
    {
        return (effect > LeadEffects.BASE) && (effect <= LeadEffects.MAX) && (((effect - LeadEffects.BASE) % 16) >= 1) && (((effect - LeadEffects.BASE) % 16) <= 10);
    }

    /** couleur des etincelles */
    public static sparkleColor(effect: number): number
    {
        switch(LeadEffects.tint(effect))
        {
            case LeadEffects.GOLD: return 0xFFE066;
            case LeadEffects.SILVER: return 0xF2F7FF;
            case LeadEffects.BRONZE: return 0xFFB56B;
            default: return 0xFFFFFF;
        }
    }

    /** teinte metallique : la luminosite de l'avatar est reportee entre une couleur sombre et une couleur claire */
    public static filter(effect: number): ColorMatrixFilter
    {
        let lo: number[] = null;
        let hi: number[] = null;

        effect = LeadEffects.tint(effect);

        switch(effect)
        {
            case LeadEffects.GOLD: lo = [ 0.42, 0.27, 0.00 ]; hi = [ 1.00, 0.92, 0.50 ]; break;
            case LeadEffects.SILVER: lo = [ 0.28, 0.31, 0.38 ]; hi = [ 0.98, 0.99, 1.00 ]; break;
            case LeadEffects.BRONZE: lo = [ 0.36, 0.16, 0.05 ]; hi = [ 1.00, 0.70, 0.42 ]; break;
            default: return null;
        }

        let filter = LeadEffects._filters.get(effect);

        if(!filter)
        {
            filter = new ColorMatrixFilter();

            const row = (i: number) => [ 0.30 * (hi[i] - lo[i]), 0.59 * (hi[i] - lo[i]), 0.11 * (hi[i] - lo[i]), 0, lo[i] ];

            filter.matrix = [ ...row(0), ...row(1), ...row(2), 0, 0, 0, 1, 0 ] as any;
            (filter as any).__bobbaLead = effect;

            LeadEffects._filters.set(effect, filter);
        }

        return filter;
    }

    private static isLeadFilter(filter: Filter): boolean
    {
        return !!filter && ((filter as any).__bobbaLead !== undefined);
    }

    /** pose ou retire la teinte sur le sprite de l'avatar, sans toucher aux autres filtres (surbrillance wired...) */
    public static apply(sprite: IRoomObjectSprite, effect: number): void
    {
        if(!sprite) return;

        const wanted = LeadEffects.isLead(effect) ? LeadEffects.filter(effect) : null;
        const current = (sprite.filters || []) as Filter[];
        const kept = current.filter(filter => !LeadEffects.isLeadFilter(filter));
        const has = wanted && current.includes(wanted);

        if((kept.length === current.length) && (!wanted || has)) return;

        const next = wanted ? [ ...kept, wanted ] : kept;

        sprite.filters = (next.length ? next : null);
    }
}
