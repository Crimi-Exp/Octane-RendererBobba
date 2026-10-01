import { IMessageComposer } from '@octane/api';

/** Bobba Loop : commandes tenues (bits) : 1 gaz, 2 frein, 4 incliner en arriere, 8 en avant, 16 nitro. */
export class LoopInputComposer implements IMessageComposer<ConstructorParameters<typeof LoopInputComposer>>
{
    private _data: ConstructorParameters<typeof LoopInputComposer>;

    constructor(input: number)
    {
        this._data = [input] as unknown as ConstructorParameters<typeof LoopInputComposer>;
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
