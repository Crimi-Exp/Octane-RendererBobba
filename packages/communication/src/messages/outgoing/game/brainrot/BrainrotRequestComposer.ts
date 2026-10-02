import { IMessageComposer } from '@octane/api';

/**
 * Brainrot : 1 l'etat de l'appart ou j'arrive (rien si ce n'est pas un appart Brainrot), 2 aller dans un appart Brainrot,
 * 3 double-clic sur un mobi du jeu (id = son id dans le jeu).
 */
export class BrainrotRequestComposer implements IMessageComposer<ConstructorParameters<typeof BrainrotRequestComposer>>
{
    private _data: ConstructorParameters<typeof BrainrotRequestComposer>;

    constructor(type: number, id: number = 0)
    {
        this._data = ((type === 3) ? [ type, id ] : [ type ]) as unknown as ConstructorParameters<typeof BrainrotRequestComposer>;
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
