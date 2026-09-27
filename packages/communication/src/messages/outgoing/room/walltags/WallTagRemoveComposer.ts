import { IMessageComposer } from '@octane/api';

/** Suppression d'un tag (id) ou de tous les tags de la piece (0, proprietaire uniquement). */
export class WallTagRemoveComposer implements IMessageComposer<ConstructorParameters<typeof WallTagRemoveComposer>>
{
    private _data: ConstructorParameters<typeof WallTagRemoveComposer>;

    constructor(tagId: number = 0)
    {
        this._data = [tagId];
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
