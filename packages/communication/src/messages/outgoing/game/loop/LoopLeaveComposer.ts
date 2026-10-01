import { IMessageComposer } from '@octane/api';

/** Bobba Loop : quitter la file ou la course. */
export class LoopLeaveComposer implements IMessageComposer<ConstructorParameters<typeof LoopLeaveComposer>>
{
    private _data: ConstructorParameters<typeof LoopLeaveComposer>;

    constructor()
    {
        this._data = [] as unknown as ConstructorParameters<typeof LoopLeaveComposer>;
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
