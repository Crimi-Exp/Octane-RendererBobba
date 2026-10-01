import { IMessageComposer } from '@octane/api';

/** UNO : 1 poser (carte, couleur), 2 piocher, 3 passer, 4 dire UNO, 5 contre-UNO. */
export class UnoActionComposer implements IMessageComposer<ConstructorParameters<typeof UnoActionComposer>>
{
    private _data: ConstructorParameters<typeof UnoActionComposer>;

    constructor(type: number, a: number = 0, b: number = 0)
    {
        this._data = [type, a, b] as unknown as ConstructorParameters<typeof UnoActionComposer>;
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
