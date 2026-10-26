import { IMessageComposer } from '@octane/api';

/** Rocket Bobba : volant, gaz, direction voulue (0 a 7, -1 au volant), boost (0/1), compteur de sauts. */
export class RocketInputComposer implements IMessageComposer<ConstructorParameters<typeof RocketInputComposer>>
{
    private _data: ConstructorParameters<typeof RocketInputComposer>;

    constructor(steer: number, throttle: number, aim: number, boost: number, jumpSeq: number)
    {
        this._data = [steer, throttle, aim, boost, jumpSeq] as ConstructorParameters<typeof RocketInputComposer>;
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
