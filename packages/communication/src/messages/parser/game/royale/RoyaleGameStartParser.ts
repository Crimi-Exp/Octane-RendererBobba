import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IRoyalePlayerInfo
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
    /** 0 pistolet, 1 fusil a pompe, 2 sniper, 3 deux pistolets */
    weapon: number;
    /** enable de son arme */
    effect: number;
}

/**
 * Depart d'une partie de Bobba Royale : carte (lignes separees par | : . sol, c caisse, w mur), joueurs, puis le
 * style de carte (0 entrepot, 1 labyrinthe, 2 forteresse, 3 champ de tir, 4 allees, 5 grand labyrinthe), et
 * l'arme et l'enable de chaque joueur. Carte : . sol, c caisse, w mur, b buisson.
 */
export class RoyaleGameStartParser implements IMessageParser
{
    private _gameId: number;
    private _size: number;
    private _map: string;
    private _yourIndex: number;
    private _countdownMs: number;
    private _gameMs: number;
    private _gunEffect: number;
    private _players: IRoyalePlayerInfo[];
    private _mapStyle: number;

    public flush(): boolean
    {
        this._gameId = 0;
        this._size = 0;
        this._map = '';
        this._yourIndex = -1;
        this._countdownMs = 0;
        this._gameMs = 0;
        this._gunEffect = 0;
        this._players = [];
        this._mapStyle = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._gameId = wrapper.readInt();
        this._size = wrapper.readInt();
        this._map = wrapper.readString();
        this._yourIndex = wrapper.readInt();
        this._countdownMs = wrapper.readInt();
        this._gameMs = wrapper.readInt();
        this._gunEffect = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._players.push({
                userId: wrapper.readInt(),
                name: wrapper.readString(),
                figure: wrapper.readString(),
                gender: wrapper.readString(),
                bot: wrapper.readBoolean(),
                weapon: 0,
                effect: 0
            });
        }

        if(wrapper.bytesAvailable) this._mapStyle = wrapper.readInt();
        for(const player of this._players)
        {
            if(!wrapper.bytesAvailable) break;
            player.weapon = wrapper.readInt();
            player.effect = wrapper.readInt();
        }

        return true;
    }

    public get gameId(): number
    {
        return this._gameId;
    }
    public get size(): number
    {
        return this._size;
    }
    public get map(): string
    {
        return this._map;
    }
    public get yourIndex(): number
    {
        return this._yourIndex;
    }
    public get countdownMs(): number
    {
        return this._countdownMs;
    }
    public get gameMs(): number
    {
        return this._gameMs;
    }
    public get gunEffect(): number
    {
        return this._gunEffect;
    }
    public get players(): IRoyalePlayerInfo[]
    {
        return this._players;
    }
    public get mapStyle(): number
    {
        return this._mapStyle;
    }
}
