import { AlphaTolerance, IRoomGeometry, RoomObjectVariable } from '@octane/api';
import { Texture } from 'pixi.js';
import { FurnitureVisualization } from './FurnitureVisualization';
import { createWfLabelBubbleTexture, getWfLabelBubbleResourceVersion, getWfLabelText } from './WfLabelBubbleTexture';

/**
 * wf_label : la bulle de texte est une couche du mobi, triee en profondeur avec la piece.
 * Un avatar devant le mobi passe donc devant la bulle, un avatar derriere passe dessous.
 */
export class FurnitureLabelVisualization extends FurnitureVisualization
{
    /** Mis a 1 par le client pendant l'edition : la bulle de la piece est masquee sous l'editeur. */
    public static EDITING_KEY = 'furniture_wf_label_editing';

    // Ecart entre la pointe et le haut du mobi, en pixels du jeu.
    private static POINTER_GAP = 3;
    // Juste devant les couches du mobi, mais derriere un avatar place devant lui.
    private static BUBBLE_DEPTH = -0.3;

    private _bubbleTexture: Texture = null;
    private _bubbleKey: string = null;
    private _bubbleSpriteCounter = -1;

    public dispose(): void
    {
        this.destroyBubbleTexture();

        super.dispose();
    }

    protected getAdditionalLayerCount(): number
    {
        return (super.getAdditionalLayerCount() + 1);
    }

    private get bubbleLayerId(): number
    {
        return (this._layerCount - 1);
    }

    protected updateSprite(scale: number, layerId: number): void
    {
        // La couche bulle est geree par updateBubble, apres les couches du mobi.
        if(layerId === this.bubbleLayerId) return;

        super.updateSprite(scale, layerId);
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        super.update(geometry, time, update, skipUpdate);

        if(!geometry || !this.object) return;

        const model = this.object.model;
        const text = getWfLabelText(model.getValue<string>(RoomObjectVariable.FURNITURE_DATA));
        const editing = (model.getValue<number>(FurnitureLabelVisualization.EDITING_KEY) === 1);
        const key = `${ getWfLabelBubbleResourceVersion() }|${ editing ? 1 : 0 }|${ text }`;

        // Redessine si le texte, l'etat d'edition ou les ressources ont change, ou si le mobi a ete redessine.
        if((key === this._bubbleKey) && (this._bubbleSpriteCounter === this.updateSpriteCounter)) return;

        if(key !== this._bubbleKey)
        {
            this.destroyBubbleTexture();
            this._bubbleTexture = (editing ? null : createWfLabelBubbleTexture(text));
            this._bubbleKey = key;
        }

        this.updateBubble(geometry.scale);

        // Signale a la piece que les sprites ont change, meme si seule la bulle a bouge.
        this.updateSpriteCounter++;
        this._bubbleSpriteCounter = this.updateSpriteCounter;
    }

    private updateBubble(scale: number): void
    {
        if(this._layerCount !== this.totalSprites) this.createSprites(this._layerCount);

        const sprite = this.getSprite(this.bubbleLayerId);

        if(!sprite) return;

        if(!this._bubbleTexture)
        {
            // Pas de texte (ou edition en cours) : aucune bulle dans la piece.
            sprite.visible = false;
            sprite.texture = null;
            sprite.tag = '';
            sprite.alpha = 0;
            sprite.alphaTolerance = AlphaTolerance.MATCH_NOTHING;
            sprite.clickHandling = false;

            return;
        }

        // Haut et centre du mobi d'apres ses couches deja placees (hors ombre, etoiles et bulle).
        let top = 0;
        let left = 0;
        let right = 0;
        let found = false;

        for(let layerId = 0; layerId < this._shadowLayerIndex; layerId++)
        {
            const layer = this.getSprite(layerId);

            if(!layer || !layer.visible || !layer.texture) continue;

            const layerLeft = (layer.flipH ? (layer.offsetX - layer.width) : layer.offsetX);

            if(!found || (layer.offsetY < top)) top = layer.offsetY;
            if(!found || (layerLeft < left)) left = layerLeft;
            if(!found || ((layerLeft + layer.width) > right)) right = (layerLeft + layer.width);

            found = true;
        }

        const zoom = ((scale > 0) ? (scale / 64) : 1);
        const width = (this._bubbleTexture.width * zoom);
        const height = (this._bubbleTexture.height * zoom);
        const centerX = (found ? ((left + right) / 2) : 0);
        const bottom = (top - (FurnitureLabelVisualization.POINTER_GAP * zoom));

        sprite.visible = true;
        sprite.type = this._type;
        sprite.texture = this._bubbleTexture;
        sprite.flipH = false;
        sprite.flipV = false;
        sprite.direction = this.direction;
        sprite.scale = zoom;
        sprite.offsetX = Math.round(centerX - (width / 2));
        sprite.offsetY = Math.round(bottom - height);
        sprite.alpha = Math.round(255 * this._alphaMultiplier);
        sprite.color = 0xFFFFFF;
        sprite.blendMode = 'normal';
        // Clic sur la bulle = clic sur le mobi (selection, double-clic pour editer).
        sprite.alphaTolerance = AlphaTolerance.MATCH_OPAQUE_PIXELS;
        sprite.clickHandling = this._clickHandling;
        sprite.tag = 'wf_label_bubble';
        sprite.relativeDepth = (FurnitureLabelVisualization.BUBBLE_DEPTH * FurnitureVisualization.DEPTH_MULTIPLIER);
        sprite.name = 'wf_label_bubble';
        sprite.libraryAssetName = '';
        sprite.posture = '';
        sprite.filters = null;
    }

    private destroyBubbleTexture(): void
    {
        if(this._bubbleTexture)
        {
            this._bubbleTexture.destroy(true);
            this._bubbleTexture = null;
        }

        this._bubbleKey = null;
    }
}
