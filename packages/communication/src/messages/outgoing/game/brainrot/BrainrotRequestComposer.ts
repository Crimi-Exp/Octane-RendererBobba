import { IMessageComposer } from '@octane/api';

/** Brainrot : 1 l'etat de l'appart ou j'arrive (rien si ce n'est pas un appart Brainrot), 2 aller dans un appart Brainrot. */
export class BrainrotRequestComposer implements IMessageComposer<ConstructorParameters<typeof BrainrotRequestComposer>>
{
    private _data: ConstructorParameters<typeof BrainrotRequestComposer>;

    constructor(type: number)
    {
        this._data = [type] as unknown as ConstructorParameters<typeof BrainrotRequestComposer>;
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
