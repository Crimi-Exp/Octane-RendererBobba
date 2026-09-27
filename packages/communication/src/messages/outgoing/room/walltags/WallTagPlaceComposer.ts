import { IMessageComposer } from '@octane/api';

/** Pose d'un tag : position murale, largeur, hauteur, PNG base64 (sans prefixe data:). */
export class WallTagPlaceComposer implements IMessageComposer<ConstructorParameters<typeof WallTagPlaceComposer>>
{
    private _data: ConstructorParameters<typeof WallTagPlaceComposer>;

    constructor(wallPosition: string, width: number, height: number, data: string)
    {
        this._data = [wallPosition, width, height, data];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
