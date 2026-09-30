import { IMessageComposer } from '@octane/api';

/** BobbaKart : volant (-1, 0, 1), accelerateur (-1 frein, 0, 1), direction voulue a l'ecran (0 a 7, -1 = au volant) et derapage (0/1). */
export class KartInputComposer implements IMessageComposer<ConstructorParameters<typeof KartInputComposer>>
{
    private _data: ConstructorParameters<typeof KartInputComposer>;

    constructor(steer: number, throttle: number, aim: number, drift: number = 0)
    {
        this._data = [steer, throttle, aim, drift] as ConstructorParameters<typeof KartInputComposer>;
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
