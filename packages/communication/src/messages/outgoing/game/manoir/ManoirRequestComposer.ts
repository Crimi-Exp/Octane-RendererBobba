import { IMessageComposer } from '@octane/api';

/** Le Manoir : 1 basculer la torche (allumer / eteindre), 2 demander le classement de l'appart. */
export class ManoirRequestComposer implements IMessageComposer<ConstructorParameters<typeof ManoirRequestComposer>>
{
    private _data: ConstructorParameters<typeof ManoirRequestComposer>;

    constructor(action: number)
    {
        this._data = [ action ];
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
