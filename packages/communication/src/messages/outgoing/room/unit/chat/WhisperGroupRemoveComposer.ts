import { IMessageComposer } from '@octane/api';

/** BobbaTok : retirer un membre du murmure en groupe. */
export class WhisperGroupRemoveComposer implements IMessageComposer<ConstructorParameters<typeof WhisperGroupRemoveComposer>>
{
    private _data: ConstructorParameters<typeof WhisperGroupRemoveComposer>;

    constructor(userId: number)
    {
        this._data = [ userId ];
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
