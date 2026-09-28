import { IMessageComposer } from '@octane/api';

/** Action du joueur : 1 = coup d'oreiller, 2 = esquive. */
export class WobbleActionComposer implements IMessageComposer<ConstructorParameters<typeof WobbleActionComposer>>
{
    private _data: ConstructorParameters<typeof WobbleActionComposer>;

    constructor(action: number)
    {
        this._data = [action] as ConstructorParameters<typeof WobbleActionComposer>;
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
