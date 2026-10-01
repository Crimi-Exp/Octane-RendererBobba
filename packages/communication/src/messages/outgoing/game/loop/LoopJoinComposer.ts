import { IMessageComposer } from '@octane/api';

/** Bobba Loop : rejoindre la file (mode 0) ou courir tout de suite contre les bots (mode 1). */
export class LoopJoinComposer implements IMessageComposer<ConstructorParameters<typeof LoopJoinComposer>>
{
    private _data: ConstructorParameters<typeof LoopJoinComposer>;

    constructor(mode: number)
    {
        this._data = [mode] as unknown as ConstructorParameters<typeof LoopJoinComposer>;
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
