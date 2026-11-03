import { IMessageComposer } from '@octane/api';

/** BobbaTok : le joueur active/retire une reaction (emoji) sur un message de tchat. */
export class RoomChatReactComposer implements IMessageComposer<ConstructorParameters<typeof RoomChatReactComposer>>
{
    private _data: ConstructorParameters<typeof RoomChatReactComposer>;

    constructor(messageId: number, reaction: number)
    {
        this._data = [ messageId, reaction ];
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
