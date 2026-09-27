import { IAssetData, IObjectVisualizationData } from '@octane/api';

/** Les tags muraux n'ont pas d'asset .nitro : rien a charger. */
export class WallTagVisualizationData implements IObjectVisualizationData
{
    public initialize(asset: IAssetData): boolean
    {
        return true;
    }

    public dispose(): void
    {
        return;
    }
}
