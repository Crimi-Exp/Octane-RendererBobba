import { IMessageComposer } from '@octane/api';

/** Action du joueur : 4/5 = pousser a gauche/droite, 6/7 = avancer/reculer, 8 = se stabiliser. */
export class WobbleActionComposer implements IMessageComposer<ConstructorParameters<typeof WobbleActionComposer>>
{
    private _data: ConstructorParameters<typeof WobbleActionComposer>;

    constructor(action: number)
    {
        this._data = [action] as ConstructorParameters<typeof WobbleActionComposer>;
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
