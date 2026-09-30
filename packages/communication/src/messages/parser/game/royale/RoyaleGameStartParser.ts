import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IRoyalePlayerInfo
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
}

/** Depart d'une partie de Bobba Royale : carte (lignes separees par | : . sol, c caisse, w mur), joueurs. */
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
                bot: wrapper.readBoolean()
            });
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
}
