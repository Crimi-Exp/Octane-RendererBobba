import { IMessageComposer } from '@octane/api';

/**
 * BobbaTok : deplacement groupe de mobis au sol (selection multiple).
 * Paquet : int nombre, int[nombre] ids, int dx, int dy. Le serveur valide tout ou rien.
 */
export class MoveFurniGroupComposer implements IMessageComposer<number[]>
{
    private _data: number[];

    constructor(itemIds: number[], dx: number, dy: number)
    {
        const ids = itemIds.filter(id => (Number.isInteger(id) && (id > 0))).slice(0, 300);

        this._data = [ ids.length, ...ids, Math.trunc(dx), Math.trunc(dy) ];
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
