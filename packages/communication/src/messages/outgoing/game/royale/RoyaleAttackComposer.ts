import { IMessageComposer } from '@octane/api';

/** Bobba Royale : viser un joueur (son index) et lui tirer dessus des qu'il est a portee. */
export class RoyaleAttackComposer implements IMessageComposer<ConstructorParameters<typeof RoyaleAttackComposer>>
{
    private _data: ConstructorParameters<typeof RoyaleAttackComposer>;

    constructor(target: number)
    {
        this._data = [target] as ConstructorParameters<typeof RoyaleAttackComposer>;
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
