import { IMessageComposer } from '@octane/api';

/** FastFood : 1 lacher le plat / ouvrir le parachute, 2 missile, 3 bouclier, 4 grand parachute. */
export class FastFoodActionComposer implements IMessageComposer<ConstructorParameters<typeof FastFoodActionComposer>>
{
    private _data: ConstructorParameters<typeof FastFoodActionComposer>;

    constructor(action: number)
    {
        this._data = [action] as unknown as ConstructorParameters<typeof FastFoodActionComposer>;
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
