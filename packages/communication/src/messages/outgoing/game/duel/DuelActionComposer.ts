import { IMessageComposer } from '@octane/api';

/** Duel des Sorciers : 0 aller sur la case (a, b), 1 lancer le sort a (6 = grand sort), 2 appuis sur espace (a). */
export class DuelActionComposer implements IMessageComposer<ConstructorParameters<typeof DuelActionComposer>>
{
    private _data: ConstructorParameters<typeof DuelActionComposer>;

    constructor(type: number, a: number = 0, b: number = 0)
    {
        this._data = [type, a, b] as unknown as ConstructorParameters<typeof DuelActionComposer>;
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
