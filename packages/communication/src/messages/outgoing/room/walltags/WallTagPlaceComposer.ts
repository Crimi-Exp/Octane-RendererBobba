import { IMessageComposer } from '@octane/api';

/**
 * Pose d'un tag : position murale, largeur, hauteur, image base64 (PNG ou WebP, sans prefixe data:),
 * puis le nombre et la liste des anciens tags du meme mur a retirer si la pose est acceptee.
 */
export class WallTagPlaceComposer implements IMessageComposer<(string | number)[]>
{
    private _data: (string | number)[];

    constructor(wallPosition: string, width: number, height: number, data: string, replacedIds: number[] = [])
    {
        this._data = [ wallPosition, width, height, data, replacedIds.length, ...replacedIds ];
    }

    public getMessageArray(): (string | number)[]
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
