import { IMessageComposer } from '@octane/api';

/** Message de chat pendant le duel, avec le style de bulle choisi dans la barre de tchat. */
export class WobbleChatComposer implements IMessageComposer<ConstructorParameters<typeof WobbleChatComposer>>
{
    private _data: ConstructorParameters<typeof WobbleChatComposer>;

    constructor(message: string, styleId: number = 0)
    {
        this._data = [ message, styleId ] as ConstructorParameters<typeof WobbleChatComposer>;
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
