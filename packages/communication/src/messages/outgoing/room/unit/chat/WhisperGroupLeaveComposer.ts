import { IMessageComposer } from '@octane/api';

/** BobbaTok : quitter son murmure en groupe. */
export class WhisperGroupLeaveComposer implements IMessageComposer<ConstructorParameters<typeof WhisperGroupLeaveComposer>>
{
    private _data: ConstructorParameters<typeof WhisperGroupLeaveComposer>;

    constructor()
    {
        this._data = [];
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
