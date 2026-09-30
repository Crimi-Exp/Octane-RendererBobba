import { IMessageComposer } from '@octane/api';

/** BobbaKart : volant (-1, 0, 1) et accelerateur (-1 frein, 0, 1). */
export class KartInputComposer implements IMessageComposer<ConstructorParameters<typeof KartInputComposer>>
{
    private _data: ConstructorParameters<typeof KartInputComposer>;

    constructor(steer: number, throttle: number)
    {
        this._data = [steer, throttle] as ConstructorParameters<typeof KartInputComposer>;
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
