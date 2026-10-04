import { IMessageComposer } from '@octane/api';

/** Duel des Sorciers : quitter la file ou abandonner le duel. */
export class DuelLeaveComposer implements IMessageComposer<ConstructorParameters<typeof DuelLeaveComposer>>
{
    private _data: ConstructorParameters<typeof DuelLeaveComposer>;

    constructor()
    {
        this._data = [] as unknown as ConstructorParameters<typeof DuelLeaveComposer>;
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
