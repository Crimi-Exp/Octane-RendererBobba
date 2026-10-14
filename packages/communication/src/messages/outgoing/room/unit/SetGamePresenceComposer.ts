import { IMessageComposer } from '@octane/api';

/** BobbaTok : le jeu auquel le joueur joue ('uno', 'kart', 'hub' = Game Center ouvert, '' = plus rien). */
export class SetGamePresenceComposer implements IMessageComposer<ConstructorParameters<typeof SetGamePresenceComposer>>
{
    private _data: ConstructorParameters<typeof SetGamePresenceComposer>;

    constructor(game: string)
    {
        this._data = [game];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }
}
