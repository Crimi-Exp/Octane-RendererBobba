import { IMessageComposer } from '@octane/api';

/** BobbaTok : inviter un avatar a rejoindre le murmure en groupe ("Joindre a la murmure"). */
export class WhisperGroupInviteComposer implements IMessageComposer<ConstructorParameters<typeof WhisperGroupInviteComposer>>
{
    private _data: ConstructorParameters<typeof WhisperGroupInviteComposer>;

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
