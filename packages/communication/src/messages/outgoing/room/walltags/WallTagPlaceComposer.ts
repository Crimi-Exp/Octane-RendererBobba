import { IMessageComposer } from '@octane/api';

/** Pose d'un tag : position murale, largeur, hauteur, PNG base64 (sans prefixe data:). */
export class WallTagPlaceComposer implements IMessageComposer<ConstructorParameters<typeof WallTagPlaceComposer>>
{
    private _data: ConstructorParameters<typeof WallTagPlaceComposer>;

    /** replacedIds : anciens tags du meme mur a retirer, seulement si la pose est acceptee par l'emulateur. */
    constructor(wallPosition: string, width: number, height: number, data: string, replacedIds: number[] = [])
    {
        this._data = [wallPosition, width, height, data, replacedIds.length, ...replacedIds];
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
