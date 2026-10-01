import { IMessageComposer } from '@octane/api';

/** UNO : quitter la file ou la partie. */
export class UnoLeaveComposer implements IMessageComposer<ConstructorParameters<typeof UnoLeaveComposer>>
{
    private _data: ConstructorParameters<typeof UnoLeaveComposer>;

    constructor()
    {
        this._data = [] as unknown as ConstructorParameters<typeof UnoLeaveComposer>;
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
