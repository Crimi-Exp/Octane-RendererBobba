import { AvatarAction, IRoomObjectSprite } from '@octane/api';
import { Texture } from 'pixi.js';
import { LeadEffects } from '../../LeadEffects';
import { AvatarVisualization } from '../AvatarVisualization';
import { IAvatarAddition } from './IAvatarAddition';

/**
 * BobbaTok (patch 44) : etincelle qui scintille et saute autour d'un bot champion (effets 9001-9004).
 * Une seule addition = un seul sprite ; l'etoile change de taille a chaque image et de place a chaque cycle.
 */
export class LeadSparkleAddition implements IAvatarAddition
{
    private static _textures: Texture[] = null;
    private static readonly FRAMES = [ 0, 1, 2, 1, 0, -1, -1, -1 ];

    private _tick: number = 0;
    private _step: number = 0;
    private _x: number = 0;
    private _y: number = -40;
    private _seed: number = Math.random() * 1000;
    private _scale: number = 64;

    constructor(
        private _id: number,
        private _visualization: AvatarVisualization,
        private _effect: number)
    {}

    public dispose(): void
    {
        this._visualization = null;
    }

    public get effect(): number
    {
        return this._effect;
    }

    private static textures(): Texture[]
    {
        if(LeadSparkleAddition._textures) return LeadSparkleAddition._textures;

        const sizes = [ 5, 7, 9 ];
        const out: Texture[] = [];

        for(const size of sizes)
        {
            const canvas = document.createElement('canvas');

            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            const c = Math.floor(size / 2);

            ctx.fillStyle = '#ffffff';
            // etoile a 4 branches en pixels : une croix pleine, et le centre un peu plus large
            for(let i = 0; i < size; i++)
            {
                ctx.fillRect(c, i, 1, 1);
                ctx.fillRect(i, c, 1, 1);
            }
            if(size >= 7)
            {
                ctx.fillRect(c - 1, c - 1, 3, 3);
            }

            out.push(Texture.from(canvas));
        }

        LeadSparkleAddition._textures = out;

        return out;
    }

    private place(scale: number): void
    {
        // a l'interieur de la silhouette (le sprite de l'avatar fait 64 px de large pour 110 de haut a l'echelle 64)
        const k = (scale < 48) ? 0.5 : 1;
        const r = () => { this._seed = (this._seed * 9301 + 49297) % 233280; return this._seed / 233280; };

        // les additions sont placees par rapport au coin haut-gauche de la case de l'avatar : son centre est a scale / 2
        this._x = Math.round((scale / 2) + (-18 + r() * 36) * k);
        this._y = Math.round((-88 + r() * 84) * k);

        if(this._visualization && (this._visualization.posture === AvatarAction.POSTURE_SIT)) this._y += Math.round(16 * k);
        else if(this._visualization && (this._visualization.posture === AvatarAction.POSTURE_LAY)) this._y += Math.round(48 * k);
    }

    public update(sprite: IRoomObjectSprite, scale: number): void
    {
        if(!sprite) return;

        this._scale = scale;
        this.place(scale);
        this.paint(sprite, scale);
    }

    private paint(sprite: IRoomObjectSprite, scale: number): void
    {
        const frame = LeadSparkleAddition.FRAMES[this._step % LeadSparkleAddition.FRAMES.length];
        const textures = LeadSparkleAddition.textures();

        if(frame < 0)
        {
            sprite.visible = false;
            return;
        }

        const texture = textures[Math.min(frame, textures.length - 1)];

        sprite.visible = true;
        sprite.texture = texture;
        sprite.alpha = 255;
        sprite.color = LeadEffects.sparkleColor(this._effect);
        sprite.offsetX = this._x - Math.floor(texture.width / 2);
        sprite.offsetY = this._y - Math.floor(texture.height / 2);
        sprite.relativeDepth = -0.03;
    }

    public animate(sprite: IRoomObjectSprite): boolean
    {
        if(!sprite) return false;

        this._tick++;

        // une image toutes les 4 mises a jour ; a la fin du cycle, l'etoile change de place
        if((this._tick % 4) !== 0) return false;

        this._step++;

        if((this._step % LeadSparkleAddition.FRAMES.length) === 0) this.place(this._scale);

        this.paint(sprite, this._scale);

        return true;
    }

    public get id(): number
    {
        return this._id;
    }
}
