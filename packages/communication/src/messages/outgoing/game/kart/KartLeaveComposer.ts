import { IMessageComposer } from '@octane/api';

/** BobbaKart : quitter la file ou la course en cours. */
export class KartLeaveComposer implements IMessageComposer<ConstructorParameters<typeof KartLeaveComposer>>
{
    private _data: ConstructorParameters<typeof KartLeaveComposer>;

    constructor()
    {
        this._data = [] as ConstructorParameters<typeof KartLeaveComposer>;
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
