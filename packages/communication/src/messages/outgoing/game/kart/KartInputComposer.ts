import { IMessageComposer } from '@octane/api';

/** BobbaKart : volant (-1, 0, 1), accelerateur (-1 frein, 0, 1) et direction voulue a l'ecran (0 a 7, -1 = au volant). */
export class KartInputComposer implements IMessageComposer<ConstructorParameters<typeof KartInputComposer>>
{
    private _data: ConstructorParameters<typeof KartInputComposer>;

    constructor(steer: number, throttle: number, aim: number)
    {
        this._data = [steer, throttle, aim] as ConstructorParameters<typeof KartInputComposer>;
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
