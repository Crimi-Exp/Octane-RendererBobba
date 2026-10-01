import { IMessageComposer } from '@octane/api';

/** BobbaTok : poser un mur de neige devant soi (3 boules). */
export class SnowWarBuildWallComposer implements IMessageComposer<ConstructorParameters<typeof SnowWarBuildWallComposer>>
{
    private _data: ConstructorParameters<typeof SnowWarBuildWallComposer>;

    constructor()
    {
        this._data = [];
    }

    dispose(): void
    {
        this._data = null;
    }

    public getMessageArray()
    {
        return this._data;
    }
}
