import { IMessageComposer } from '@octane/api';

/** Message de chat pendant le duel. */
export class WobbleChatComposer implements IMessageComposer<ConstructorParameters<typeof WobbleChatComposer>>
{
    private _data: ConstructorParameters<typeof WobbleChatComposer>;

    constructor(message: string)
    {
        this._data = [ message ];
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
