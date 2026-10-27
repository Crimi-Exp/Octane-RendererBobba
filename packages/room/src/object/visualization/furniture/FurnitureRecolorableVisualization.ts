import { RoomObjectVariable } from '@octane/api';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

/**
 * Mobis recolorables (gamme « recolorable » de Habbo) : les calques marques « recolorable » prennent la couleur
 * choisie (cles r, g, b des donnees du mobi), les autres gardent leur couleur.
 */
export class FurnitureRecolorableVisualization extends FurnitureAnimatedVisualization
{
    public static RECOLORABLE_TAG: string = 'recolorable';
    public static DEFAULT_COLOR: number = 0xFFFFFF;

    private _color: number = FurnitureRecolorableVisualization.DEFAULT_COLOR;

    protected updateModel(scale: number): boolean
    {
        const flag = super.updateModel(scale);

        const color = FurnitureRecolorableVisualization.readColor(this.object.model.getValue<{ [index: string]: string }>(RoomObjectVariable.FURNITURE_DATA));

        if(color !== this._color)
        {
            this._color = color;

            return true;
        }

        return flag;
    }

    public static readColor(data: { [index: string]: string }): number
    {
        if(!data) return FurnitureRecolorableVisualization.DEFAULT_COLOR;

        const channel = (key: string) =>
        {
            const value = parseInt(data[key], 10);

            return (isNaN(value) ? 255 : Math.max(0, Math.min(255, value)));
        };

        if(data.r === undefined && data.g === undefined && data.b === undefined) return FurnitureRecolorableVisualization.DEFAULT_COLOR;

        return ((channel('r') << 16) | (channel('g') << 8) | channel('b'));
    }

    protected getLayerColor(scale: number, layerId: number, colorId: number): number
    {
        const tag = this.getLayerTag(scale, this._direction, layerId);

        if(tag && (tag.toLowerCase() === FurnitureRecolorableVisualization.RECOLORABLE_TAG)) return this._color;

        return super.getLayerColor(scale, layerId, colorId);
    }
}
