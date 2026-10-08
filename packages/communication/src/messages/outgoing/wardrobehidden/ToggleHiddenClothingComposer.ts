import { IMessageComposer } from '@octane/api';

/** BobbaTok (9814) : masque (true) ou remet (false) un vetement (categorie + id de la piece). Reponse : HIDDEN_CLOTHING. */
export class ToggleHiddenClothingComposer implements IMessageComposer<ConstructorParameters<typeof ToggleHiddenClothingComposer>>
{
    private _data: ConstructorParameters<typeof ToggleHiddenClothingComposer>;

    constructor(setType: string, partId: number, hidden: boolean)
    {
        this._data = [ setType, partId, hidden ];
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
