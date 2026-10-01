import { IMessageComposer } from '@octane/api';

/** FastFood : rejoindre la file (mode 0) ou jouer tout de suite contre les bots (mode 1). */
export class FastFoodJoinComposer implements IMessageComposer<ConstructorParameters<typeof FastFoodJoinComposer>>
{
    private _data: ConstructorParameters<typeof FastFoodJoinComposer>;

    constructor(mode: number)
    {
        this._data = [mode] as unknown as ConstructorParameters<typeof FastFoodJoinComposer>;
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
