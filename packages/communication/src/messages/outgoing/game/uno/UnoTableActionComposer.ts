import { IMessageComposer } from '@octane/api';

/**
 * UNO, salons et appart : 1 creer (places, bots), 2 inviter (id, 0 = tout l'appart), 3 rejoindre (id du salon),
 * 4 quitter le salon, 5 lancer, 6 reglages (places, bots), 7 regarder ou rejoindre un joueur (id), 8 qui joue ici.
 */
export class UnoTableActionComposer implements IMessageComposer<ConstructorParameters<typeof UnoTableActionComposer>>
{
    private _data: ConstructorParameters<typeof UnoTableActionComposer>;

    constructor(type: number, a: number = 0, b: number = 0)
    {
        this._data = [type, a, b] as unknown as ConstructorParameters<typeof UnoTableActionComposer>;
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
