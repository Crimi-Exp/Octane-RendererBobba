import { IMessageComposer } from '@octane/api';

/** Rocket Bobba : rejoindre la file (mode 0) ou jouer contre des bots (mode 1), taille d'equipe (1 a 3), voiture. */
export class RocketJoinComposer implements IMessageComposer<ConstructorParameters<typeof RocketJoinComposer>>
{
    private _data: ConstructorParameters<typeof RocketJoinComposer>;

    constructor(mode: number, size: number, car: number)
    {
        this._data = [mode, size, car] as ConstructorParameters<typeof RocketJoinComposer>;
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
