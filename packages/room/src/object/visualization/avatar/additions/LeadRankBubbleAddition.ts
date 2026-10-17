import { AvatarAction, IRoomObjectSprite } from '@octane/api';
import { Texture } from 'pixi.js';
import { LeadEffects } from '../../LeadEffects';
import { AvatarVisualization } from '../AvatarVisualization';
import { IAvatarAddition } from './IAvatarAddition';

/**
 * BobbaTok (patch 44) : petite boite Illumina (sombre) au-dessus d'un bot champion : etoile or / argent / bronze (ou
 * coupe) + sa place + le classement. Dessinee en canvas avec les couleurs du skin illumina_dark de Habbo AIR,
 * les icones sont celles du client AIR (small_gold / small_silver / small_bronze / highscore_cup).
 */
export class LeadRankBubbleAddition implements IAvatarAddition
{
    private static ICONS: Record<string, string> = {
        gold: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAABFUlEQVR42q1SPWvCQBh+cgmFg5skLfYfyLn1NwW6OrgcJUMpbTZ3wd/hL3Bw6hZxEZ2qNJmkGKlt3y6Xy13knHzg4OV93u/nAA+UFOTjGK4FJQUdKCNfN3bVLvQBb7fo0sK+owRKCkrzJyeIb5Wxq/vM4V76rwCAWElBxymn45TTKQ/pb8XMO+Wh4XTHOAAQ6xGKx+QG3V6F8O7HVP79jLBbcown38gWX7cAEGjuLLFGOwFAyaxli3SeOAkA0O1VSOcJlBRFW6cSANhsbKo/D0Pslhy2v45rtNkPaDPqkJLCLFzbm1GHDvuB0SwyZ35ft2dv7Iko3h7WjU62eHaCHiW2d9YxgXO9s7kbOHz7w5aen+T4/wEkaZYgTG/XiwAAAABJRU5ErkJggg==',
        silver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAABWElEQVR42pWSsU4CURBFz0MTVCyh3k1I6KR4tI+foLHQBgs/wdrC2PgRhsIWO34AChswwcSNIJG1sYAQdYPsQjEWsJtlDYncZJo3dzJz372wAbYuy6ZealMDxXawtREREVsb+fcmYdstpbKIiExn/nJb6a+2XVsbQSkQWQqRBEcEK3amit8fx+TrO6okLG1EAVlLm9H93S0AmXSavb10tMj3A6ZBAEDlpMqw08qlANxOK1c5PePJeWXieUxnflQTz6Pr9KMBgB3gBzj4/Hi/eey7F8WjIoeZfYLFgmA+pzdwuby6jgaAcSrmzWjYblLI26BU5G4hb/HWbmJpM0r6NEYpHrrPgNAbuBxXz3kZuACr9xUvmYBavSF2qRwmIWtpI5Y2Uqs3VgmJeWZrIx2nH5GTZZfK0nH6EvqlAMK/j4kNT8nGNbPkqDDL2QQ5ibV+MrDjDZFce/8FA4/VrvYcC/IAAAAASUVORK5CYII=',
        bronze: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAABGklEQVR42q2Sv0oDQRDGf3smVtosFwKpDqzvulQ2eQOrsEV8FMs8gyF9rghWkjdQhNS5WggBxWOPa7QymrW5vX9hrTLVMPN9M9/8AYcpiXHlPE5lSmJ+nsfG1c07aZfd/cDZrfPfwK6lCCUx8eO4AXpPXkp/EF43cpObBwTgK4m+m/QBuLjyODsXJej32/D1egBgGqcsc3oC8AsJ+jaSBGGXy361n8/0wDbZs9jkLHN6ALbkEdFamwBkXm1YPZsPGwSAIOwymw9REt2+Uwbw9rQrq0/jlG2ypx63uHKlOo7MaiSNktjb+NZfjaTRcVTerGOJH+u0rb3yN7kO1pVsUT9enVBI8eszFxjR2N6R7soa+fbDZo5PasT/AHoFfIQQAGXVAAAAAElFTkSuQmCC',
        cup: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAMCAYAAAC9QufkAAACfklEQVR42mVRW0iTcRw9/29zS2depy7NkFkPqZEQZXhBo4tkEYVhqWkXEKGHQASTKD4wxUh8UFDKMsJKFPaQhhWFqKWliDa7aBeNyl2cW/q5Dd3t+369aISdp/NwzuEcDvr6eDkRPSeiXACJBQVbu6qr8nw118ukyoqdvzZtCbkEAHI5AxHP8TzPMcbwF7ruD7n7jl4oaqxNMU4+3k12fbZIptNke7OX+jszaX+2tg6ACuvAtu/S5pxIFe8MDlmjr1Zkwjo8KqYf0shitUoMPJ0nUkaQbkLkAjyLsEFe39Awow8KwknG2HGu6HBgT/yWsBmHQJ8k1yIZFFHczfvLqLzhxYNXfsxPG8R8DmFl3uhoz8kILz9XnJMKoNFo/KyWT0+ZXn4hTvHe4Jp0/jQlluTHSY6AZEaqLPi7n1Fk8FdWVSUs2JyiOXjAKAz2j7YwxvR2uz2NAcDFwmhdgNubK4kkXimL5cK3RTNokgDzBL17a6SmFgPTxPgLt7tNB202jK1t5mQc0PzIVG1b8MC44JOJXo5BdANOC+BZYSNjDs69LLLeoUWd1Urjbrer3+v1ZhERJyMCA+C0LLnNPyxS06xhOWFo5HeoecqEh50mc+/wUs3oN1fH7Jy774UE45n0DLtCoRhnjDkAAES0g4hkq20upyQGWq4VRXkBdACIW9UkE5Hf+rtAJIS2tdWpSkuT792tT6L8LBWVHAkRywsjqLU5zQAgQRA+hvE8LyciGRGx/0LOnoqfI08xtd/K9LU2ZpAwned6/eQAqdVReUS0AYD8X+Ma4QAQgD3nj2l6NseoQjxeiSSRybt6vtf2TlJz5EZBrVSG6omIY4xJAPAH8YZCK3uSCUUAAAAASUVORK5CYII='
    };
    private static _images: Map<string, HTMLImageElement> = new Map();
    private static _textures: Map<string, Texture> = new Map();

    private _texture: Texture = null;
    private _scale: number = 64;

    constructor(
        private _id: number,
        private _visualization: AvatarVisualization,
        private _effect: number)
    {}

    public dispose(): void
    {
        this._visualization = null;
        this._texture = null;
    }

    public get effect(): number
    {
        return this._effect;
    }

    private static image(key: string, onReady: () => void): HTMLImageElement
    {
        let image = LeadRankBubbleAddition._images.get(key);

        if(!image)
        {
            image = new Image();
            image.src = LeadRankBubbleAddition.ICONS[key];
            LeadRankBubbleAddition._images.set(key, image);
        }

        if(!image.complete) image.addEventListener('load', onReady, { once: true });

        return image;
    }

    private static rankLabel(rank: number): string
    {
        return (rank === 1) ? '1er' : (rank + 'e');
    }

    private build(scale: number): Texture
    {
        const rank = LeadEffects.rank(this._effect);
        const small = (scale < 48);
        const key = this._effect + ':' + (small ? 's' : 'l');
        const cached = LeadRankBubbleAddition._textures.get(key);

        if(cached) return cached;

        const iconKey = (rank === 1) ? 'gold' : (rank === 2) ? 'silver' : (rank === 3) ? 'bronze' : 'cup';
        const icon = LeadRankBubbleAddition.image(iconKey, () => { LeadRankBubbleAddition._textures.delete(key); this._texture = null; });
        const label = LeadRankBubbleAddition.rankLabel(rank);
        const game = LeadEffects.gameLabel(this._effect);
        const font = small ? 'bold 8px Ubuntu, Arial, sans-serif' : 'bold 11px Ubuntu, Arial, sans-serif';
        const subFont = small ? '7px Ubuntu, Arial, sans-serif' : '9px Ubuntu, Arial, sans-serif';
        const measure = document.createElement('canvas').getContext('2d');

        measure.font = font;
        const labelWidth = Math.ceil(measure.measureText(label).width);
        measure.font = subFont;
        const gameWidth = Math.ceil(measure.measureText(game).width);

        const iconW = small ? 8 : 13;
        const iconH = small ? 10 : 17;
        const pad = small ? 3 : 5;
        const width = pad + iconW + (small ? 3 : 5) + Math.max(labelWidth, gameWidth) + pad;
        const height = small ? 16 : 24;
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = false;

        // boite illumina_dark : contour noir, bevel (51,49,43), fond (36,33,28)
        const r = 3;
        const box = (x: number, y: number, w: number, h: number, radius: number, color: string) =>
        {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        };

        box(0, 0, width, height, r, '#000000');
        box(1, 1, width - 2, height - 2, r, '#33312b');
        box(2, 2, width - 4, height - 4, r - 1, '#24211c');

        if(icon.complete && icon.naturalWidth > 0)
        {
            ctx.drawImage(icon, pad, Math.round((height - iconH) / 2), iconW, iconH);
        }

        const textX = pad + iconW + (small ? 3 : 5);

        ctx.textBaseline = 'top';
        ctx.font = font;
        ctx.fillStyle = (rank === 1) ? '#ffe066' : (rank === 2) ? '#eef3ff' : (rank === 3) ? '#ffb56b' : '#ffffff';
        ctx.fillText(label, textX, small ? 1 : 3);
        ctx.font = subFont;
        ctx.fillStyle = '#b9b6ad';
        ctx.fillText(game, textX, small ? 8 : 13);

        const texture = Texture.from(canvas);

        LeadRankBubbleAddition._textures.set(key, texture);

        return texture;
    }

    public update(sprite: IRoomObjectSprite, scale: number): void
    {
        if(!sprite) return;

        this._scale = scale;
        this._texture = this.build(scale);

        this.paint(sprite, scale);
    }

    private paint(sprite: IRoomObjectSprite, scale: number): void
    {
        if(!this._texture) return;

        const small = (scale < 48);
        let offsetY = small ? -44 : -88;

        if(this._visualization)
        {
            if(this._visualization.posture === AvatarAction.POSTURE_SIT) offsetY += (small ? 16 : 32);
            else if(this._visualization.posture === AvatarAction.POSTURE_LAY) offsetY += scale;
        }

        sprite.visible = true;
        sprite.texture = this._texture;
        sprite.alpha = 255;
        sprite.color = 0xFFFFFF;
        sprite.offsetX = Math.round((scale / 2) - (this._texture.width / 2));
        sprite.offsetY = offsetY - this._texture.height;
        sprite.relativeDepth = -0.04;
    }

    public animate(sprite: IRoomObjectSprite): boolean
    {
        if(!sprite) return false;

        // l'icone arrive apres coup (image async) : on redessine une fois chargee
        if(!this._texture)
        {
            this._texture = this.build(this._scale);
            this.paint(sprite, this._scale);

            return true;
        }

        return false;
    }

    public get id(): number
    {
        return this._id;
    }
}
