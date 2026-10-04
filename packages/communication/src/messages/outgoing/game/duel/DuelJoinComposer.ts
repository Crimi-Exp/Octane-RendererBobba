import { IMessageComposer } from '@octane/api';

/** Duel des Sorciers : chercher un adversaire (mode 0) ou affronter un bot (mode 1), avec sa baguette (0 a 3). */
export class DuelJoinComposer implements IMessageComposer<ConstructorParameters<typeof DuelJoinComposer>>
{
    private _data: ConstructorParameters<typeof DuelJoinComposer>;

    constructor(mode: number, wand: number = 0)
    {
        this._data = [mode, wand] as unknown as ConstructorParameters<typeof DuelJoinComposer>;
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
