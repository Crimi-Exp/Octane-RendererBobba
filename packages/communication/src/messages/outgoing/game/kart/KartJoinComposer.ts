import { IMessageComposer } from '@octane/api';

/** BobbaKart : rejoindre la file (mode 0) ou courir contre les bots (mode 1) avec le kart choisi (0 a 4). */
export class KartJoinComposer implements IMessageComposer<ConstructorParameters<typeof KartJoinComposer>>
{
    private _data: ConstructorParameters<typeof KartJoinComposer>;

    constructor(mode: number, kart: number)
    {
        this._data = [mode, kart] as ConstructorParameters<typeof KartJoinComposer>;
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
