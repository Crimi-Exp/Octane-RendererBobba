import { IMessageComposer } from '@octane/api';

/** BobbaTok : accepter (true) ou refuser (false) une invitation de murmure en groupe. */
export class WhisperGroupInviteReplyComposer implements IMessageComposer<ConstructorParameters<typeof WhisperGroupInviteReplyComposer>>
{
    private _data: ConstructorParameters<typeof WhisperGroupInviteReplyComposer>;

    constructor(accept: boolean)
    {
        this._data = [ accept ];
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
