import { IMessageComposer } from '@octane/api';

/** BobbaKart : utiliser l'objet tenu. */
export class KartItemComposer implements IMessageComposer<ConstructorParameters<typeof KartItemComposer>>
{
    private _data: ConstructorParameters<typeof KartItemComposer>;

    constructor()
    {
        this._data = [] as ConstructorParameters<typeof KartItemComposer>;
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
