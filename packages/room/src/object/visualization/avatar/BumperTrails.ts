import { IRoomGeometry } from '@octane/api';
import { TextureUtils, Vector3d } from '@octane/utils';
import { Graphics, Texture } from 'pixi.js';

interface ITrailPoint { x: number; y: number; z: number; t: number; }

/**
 * BobbaTok : traces de pneus des auto tamponneuses.
 *
 * Les voitures (AvatarVisualization) deposent des points pendant une glissade, un drift ou un braquage ; l'objet
 * « room » (RoomVisualization), qui ne bouge jamais, les dessine en une seule image : deux bandes de pneus
 * continues par trace, posees a plat sur le sol, qui s'effacent en quelques secondes. Comme l'image est attachee
 * a la room et non a la voiture, les traces restent immobiles au sol.
 */
export class BumperTrails
{
    public static LIFE: number = 6000;
    private static MAX_STROKES: number = 60;
    private static TRACK_HALF_WIDTH: number = 0.17;   // demi-ecart entre les deux pneus, en cases

    private static _strokes: { car: number, points: ITrailPoint[] }[] = [];
    private static _version: number = 0;

    public static add(car: number, x: number, y: number, z: number): void
    {
        (globalThis as any).__bumperTrails = BumperTrails;   // console : __bumperTrails._strokes

        const now = Date.now();
        let stroke: { car: number, points: ITrailPoint[] } = null;

        for(let i = (BumperTrails._strokes.length - 1); i >= 0; i--)
        {
            if(BumperTrails._strokes[i].car === car) { stroke = BumperTrails._strokes[i]; break; }
        }

        const last = stroke ? stroke.points[stroke.points.length - 1] : null;

        if(last)
        {
            const gap = Math.hypot(x - last.x, y - last.y);

            if(gap < 0.04) return;

            // la voiture a ete teleportee ou s'est arretee longtemps : nouvelle trace
            if((gap > 1.6) || ((now - last.t) > 220)) stroke = null;
        }

        if(!stroke)
        {
            stroke = { car, points: [] };
            BumperTrails._strokes.push(stroke);

            if(BumperTrails._strokes.length > BumperTrails.MAX_STROKES) BumperTrails._strokes.shift();
        }

        stroke.points.push({ x, y, z, t: now });
        BumperTrails._version++;
    }

    public static clear(): void
    {
        BumperTrails._strokes = [];
        BumperTrails._version++;
    }

    public static get isEmpty(): boolean
    {
        return (BumperTrails._strokes.length === 0);
    }

    private static prune(now: number): void
    {
        const strokes: { car: number, points: ITrailPoint[] }[] = [];

        for(const stroke of BumperTrails._strokes)
        {
            const points = stroke.points.filter(point => ((now - point.t) < BumperTrails.LIFE));

            if(points.length !== stroke.points.length) BumperTrails._version++;

            if(points.length) strokes.push({ car: stroke.car, points });
        }

        if(strokes.length !== BumperTrails._strokes.length) BumperTrails._version++;

        BumperTrails._strokes = strokes;
    }

    /**
     * Dessine toutes les traces. Renvoie la texture et sa position a l'ecran (coin haut gauche), ou null s'il n'y a
     * rien a dessiner.
     */
    public static draw(geometry: IRoomGeometry): { texture: Texture, x: number, y: number } | null
    {
        const now = Date.now();

        BumperTrails.prune(now);

        if(!BumperTrails._strokes.length) return null;

        const k = (geometry.scale >= 64) ? 1 : 0.5;
        const width = Math.max(1.5, 3.2 * k);
        const tracks: { a: { x: number, y: number }, b: { x: number, y: number }, alpha: number }[] = [];

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        const screen = (x: number, y: number, z: number) =>
        {
            const point = geometry.getScreenPoint(new Vector3d(x, y, z));

            if(point)
            {
                minX = Math.min(minX, point.x); minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x); maxY = Math.max(maxY, point.y);
            }

            return point;
        };

        for(const stroke of BumperTrails._strokes)
        {
            const points = stroke.points;

            for(let i = 1; i < points.length; i++)
            {
                const p0 = points[i - 1];
                const p1 = points[i];

                let dx = (p1.x - p0.x), dy = (p1.y - p0.y);
                const length = Math.hypot(dx, dy) || 1;

                dx /= length; dy /= length;

                // les deux pneus : decales de chaque cote, perpendiculairement a la trajectoire, a plat sur le sol
                const ox = (-dy * BumperTrails.TRACK_HALF_WIDTH);
                const oy = (dx * BumperTrails.TRACK_HALF_WIDTH);
                const age = (now - p1.t) / BumperTrails.LIFE;
                const alpha = Math.max(0, 0.6 * (1 - age) * (1 - age));

                if(alpha <= 0.01) continue;

                for(const sign of [ -1, 1 ])
                {
                    const a = screen(p0.x + (ox * sign), p0.y + (oy * sign), p0.z);
                    const b = screen(p1.x + (ox * sign), p1.y + (oy * sign), p1.z);

                    if(a && b) tracks.push({ a, b, alpha });
                }
            }
        }

        if(!tracks.length) return null;

        const pad = Math.ceil(width * 2);
        const originX = Math.floor(minX) - pad;
        const originY = Math.floor(minY) - pad;

        const graphics = new Graphics();

        // cadre transparent : fixe la taille de l'image
        graphics.rect(0, 0, (Math.ceil(maxX) + pad) - originX, (Math.ceil(maxY) + pad) - originY).fill({ color: 0x000000, alpha: 0.001 });

        for(const track of tracks)
        {
            graphics.moveTo(track.a.x - originX, track.a.y - originY)
                .lineTo(track.b.x - originX, track.b.y - originY)
                .stroke({ width, color: 0x1b1b1b, alpha: track.alpha, cap: 'round', join: 'round' });
        }

        const texture = TextureUtils.generateTexture({ target: graphics, resolution: 1 });

        graphics.destroy();

        return { texture, x: originX, y: originY };
    }

    public static get version(): number
    {
        return BumperTrails._version;
    }
}
