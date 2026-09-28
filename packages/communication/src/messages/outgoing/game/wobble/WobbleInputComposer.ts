import { IMessageComposer } from '@octane/api';

/** Direction dans laquelle le joueur se penche : -1, 0 ou 1. */
export class WobbleInputComposer implements IMessageComposer<ConstructorParameters<typeof WobbleInputComposer>>
{
    private _data: ConstructorParameters<typeof WobbleInputComposer>;

    constructor(lean: number)
    {
        this._data = [lean] as ConstructorParameters<typeof WobbleInputComposer>;
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
