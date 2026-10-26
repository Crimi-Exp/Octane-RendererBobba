import { IMessageComposer } from '@octane/api';

/**
 * Rocket Bobba : volant, gaz, direction voulue (0 a 7, -1 au volant), boost (0/1), compteur de sauts,
 * puis (facultatif) la position de sa voiture vue par le client : x, y, cap, vitesse (x1000).
 */
export class RocketInputComposer implements IMessageComposer<ConstructorParameters<typeof RocketInputComposer>>
{
    private _data: ConstructorParameters<typeof RocketInputComposer>;

    constructor(steer: number, throttle: number, aim: number, boost: number, jumpSeq: number, x?: number, y?: number, heading?: number, speed?: number)
    {
        this._data = ((x === undefined) ? [ steer, throttle, aim, boost, jumpSeq ] : [ steer, throttle, aim, boost, jumpSeq, x, y, heading, speed ]) as ConstructorParameters<typeof RocketInputComposer>;
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
