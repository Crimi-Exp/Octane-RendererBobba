import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IBattleBallPlayerInfo
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
    team: number;
}

/** Depart d'une partie : arene (hauteurs et cases, lignes separees par |), joueurs, compte a rebours. */
export class BattleBallGameStartParser implements IMessageParser
{
    private _gameId: number;
    private _arenaId: number;
    private _heightmap: string;
    private _tilemap: string;
    private _yourIndex: number;
    private _teamCount: number;
    private _countdownMs: number;
    private _gameMs: number;
    private _players: IBattleBallPlayerInfo[];

    public flush(): boolean
    {
        this._gameId = 0;
        this._arenaId = 0;
        this._heightmap = '';
        this._tilemap = '';
        this._yourIndex = -1;
        this._teamCount = 2;
        this._countdownMs = 0;
        this._gameMs = 0;
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._gameId = wrapper.readInt();
        this._arenaId = wrapper.readInt();
        this._heightmap = wrapper.readString();
        this._tilemap = wrapper.readString();
        this._yourIndex = wrapper.readInt();
        this._teamCount = wrapper.readInt();
        this._countdownMs = wrapper.readInt();
        this._gameMs = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._players.push({
                userId: wrapper.readInt(),
                name: wrapper.readString(),
                figure: wrapper.readString(),
                gender: wrapper.readString(),
                bot: wrapper.readBoolean(),
                team: wrapper.readInt()
            });
        }

        return true;
    }

    public get gameId(): number
    {
        return this._gameId;
    }
    public get arenaId(): number
    {
        return this._arenaId;
    }
    public get heightmap(): string
    {
        return this._heightmap;
    }
    public get tilemap(): string
    {
        return this._tilemap;
    }
    public get yourIndex(): number
    {
        return this._yourIndex;
    }
    public get teamCount(): number
    {
        return this._teamCount;
    }
    public get countdownMs(): number
    {
        return this._countdownMs;
    }
    public get gameMs(): number
    {
        return this._gameMs;
    }
    public get players(): IBattleBallPlayerInfo[]
    {
        return this._players;
    }
}
