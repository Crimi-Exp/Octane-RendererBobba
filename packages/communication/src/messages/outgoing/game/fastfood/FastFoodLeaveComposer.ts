import { IMessageComposer } from '@octane/api';

/** FastFood : quitter la file ou la partie. */
export class FastFoodLeaveComposer implements IMessageComposer<ConstructorParameters<typeof FastFoodLeaveComposer>>
{
    private _data: ConstructorParameters<typeof FastFoodLeaveComposer>;

    constructor()
    {
        this._data = [] as unknown as ConstructorParameters<typeof FastFoodLeaveComposer>;
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
