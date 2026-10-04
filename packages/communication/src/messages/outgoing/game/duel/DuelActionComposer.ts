import { IMessageComposer } from '@octane/api';

/**
 * Duel des Sorciers : 0 aller sur la case (a, b) ; 1 lancer le sort a (8 = grand sort) vers le point (b, c) en
 * centiemes de case ; 2 maitrise du choc des baguettes (a : 0 a 100) ; 3 transplaner vers le point (a, b).
 */
export class DuelActionComposer implements IMessageComposer<ConstructorParameters<typeof DuelActionComposer>>
{
    private _data: ConstructorParameters<typeof DuelActionComposer>;

    constructor(type: number, a: number = 0, b: number = 0, c: number = 0)
    {
        this._data = [type, a, b, c] as unknown as ConstructorParameters<typeof DuelActionComposer>;
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
