import { IRoomObjectSprite } from '@octane/api';
import { GetTickerTime } from '@octane/utils';
import { Texture } from 'pixi.js';
import { AvatarVisualization } from '../AvatarVisualization';
import { IAvatarAddition } from './IAvatarAddition';

/**
 * BobbaTok : giclees d'eau autour d'un perso qui glisse sur un toboggan. Les gouttes (pixel art) sont dessinees par le
 * code, en quelques images qui tournent en boucle ; une derniere gerbe plus grosse a l'arrivee. Rien a charger.
 */
export class SlideSplashAddition implements IAvatarAddition
{
    private static FRAME_COUNT = 6;
    private static FRAME_MS = 70;
    private static WIDTH = 72;
    private static HEIGHT = 56;
    /** apres la glissade : une derniere gerbe pendant ce temps (ms) */
    public static FINAL_SPLASH_MS = 700;

    private static _frames: Texture[] = null;
    private static _finalFrames: Texture[] = null;

    private _startTime: number = GetTickerTime();
    private _frame = -1;

    constructor(
        private _id: number,
        private _visualization: AvatarVisualization,
        private _getSlidingUntil: () => number)
    {}

    public get id(): number
    {
        return this._id;
    }

    public dispose(): void
    {
        this._visualization = null;
        this._getSlidingUntil = null;
    }

    /** gouttes en pixel art : bleu clair, blanc, quelques reflets ; positions pseudo-aleatoires stables par image */
    private static buildFrames(big: boolean): Texture[]
    {
        const frames: Texture[] = [];
        const w = SlideSplashAddition.WIDTH;
        const h = SlideSplashAddition.HEIGHT;
        const colors = [ '#ffffff', '#d8f4ff', '#9fdcff', '#6cc6f5' ];
        let seed = big ? 7 : 3;
        const rand = () =>
        {
            seed = ((seed * 1103515245) + 12345) & 0x7fffffff;

            return (seed / 0x7fffffff);
        };

        for(let f = 0; f < SlideSplashAddition.FRAME_COUNT; f++)
        {
            const canvas = document.createElement('canvas');

            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext('2d');
            const drops = big ? 26 : 14;

            for(let i = 0; i < drops; i++)
            {
                // chaque goutte part du bas (la goulotte), monte en arc puis retombe selon l'image
                const side = (rand() < 0.5) ? -1 : 1;
                const speed = 0.6 + (rand() * 0.8);
                const phase = ((f / SlideSplashAddition.FRAME_COUNT) + rand()) % 1;
                const x = (w / 2) + (side * ((8 + (rand() * (big ? 26 : 18))) * phase * speed));
                const y = (h - 6) - ((Math.sin(phase * Math.PI) * (big ? 40 : 26) * speed));
                const size = (rand() < 0.25) ? 3 : 2;

                ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
                ctx.globalAlpha = 1 - (phase * 0.5);
                ctx.fillRect(Math.round(x), Math.round(y), size, size);
            }

            // ecume au ras de l'eau
            ctx.globalAlpha = 0.85;

            for(let i = 0; i < (big ? 12 : 6); i++)
            {
                ctx.fillStyle = (i % 2) ? '#ffffff' : '#c9efff';
                ctx.fillRect(Math.round((w / 2) - 16 + (rand() * 32)), (h - 6) + Math.round(rand() * 4), 2 + Math.round(rand() * 3), 2);
            }

            frames.push(Texture.from(canvas));
        }

        return frames;
    }

    private static getFrames(final: boolean): Texture[]
    {
        if(final)
        {
            if(!SlideSplashAddition._finalFrames) SlideSplashAddition._finalFrames = SlideSplashAddition.buildFrames(true);

            return SlideSplashAddition._finalFrames;
        }

        if(!SlideSplashAddition._frames) SlideSplashAddition._frames = SlideSplashAddition.buildFrames(false);

        return SlideSplashAddition._frames;
    }

    private isFinal(): boolean
    {
        const until = (this._getSlidingUntil ? this._getSlidingUntil() : 0);

        return !!until && (Date.now() > until);
    }

    private isVisible(): boolean
    {
        const until = (this._getSlidingUntil ? this._getSlidingUntil() : 0);

        return !!until && (Date.now() < (until + SlideSplashAddition.FINAL_SPLASH_MS));
    }

    public update(sprite: IRoomObjectSprite, scale: number): void
    {
        if(!sprite) return;

        const small = (scale < 48);
        const frames = SlideSplashAddition.getFrames(this.isFinal());

        sprite.texture = frames[0];
        sprite.offsetX = small ? -18 : -(SlideSplashAddition.WIDTH / 2);
        // autour du bas du perso assis (le sol de la goulotte)
        sprite.offsetY = small ? -30 : -58;
        sprite.relativeDepth = -0.02;
        sprite.alpha = this.isVisible() ? 255 : 0;
        sprite.visible = this.isVisible();

        if(small) sprite.texture = frames[0];
    }

    public animate(sprite: IRoomObjectSprite): boolean
    {
        if(!sprite) return false;

        const visible = this.isVisible();

        if(!visible)
        {
            if(sprite.visible)
            {
                sprite.visible = false;
                sprite.alpha = 0;

                return true;
            }

            return false;
        }

        const frames = SlideSplashAddition.getFrames(this.isFinal());
        const frame = Math.floor((GetTickerTime() - this._startTime) / SlideSplashAddition.FRAME_MS) % frames.length;

        if((frame === this._frame) && sprite.visible) return false;

        this._frame = frame;
        sprite.texture = frames[frame];
        sprite.visible = true;
        sprite.alpha = 255;

        return true;
    }
}
