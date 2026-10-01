import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IUnoPlayerInfo
{
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
}

/** Debut d'une partie de UNO : id, ton index, duree de la distribution, ms par carte distribuee, temps d'un tour, joueurs. */
export class UnoGameStartParser implements IMessageParser
{
    private _gameId: number;
    private _yourIndex: number;
    private _dealMs: number;
    private _dealCardMs: number;
    private _turnMs: number;
    private _players: IUnoPlayerInfo[];

    public flush(): boolean
    {
        this._gameId = 0;
        this._yourIndex = -1;
        this._dealMs = 0;
        this._dealCardMs = 110;
        this._turnMs = 15000;
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._gameId = wrapper.readInt();
        this._yourIndex = wrapper.readInt();
        this._dealMs = wrapper.readInt();
        this._dealCardMs = wrapper.readInt();
        this._turnMs = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const name = wrapper.readString();
            const figure = wrapper.readString();
            const gender = wrapper.readString();
            const bot = wrapper.readBoolean();
            this._players.push({ name, figure, gender, bot });
        }

        return true;
    }

    public get gameId(): number
    {
        return this._gameId;
    }
    public get yourIndex(): number
    {
        return this._yourIndex;
    }
    public get dealMs(): number
    {
        return this._dealMs;
    }
    public get dealCardMs(): number
    {
        return this._dealCardMs;
    }
    public get turnMs(): number
    {
        return this._turnMs;
    }
    public get players(): IUnoPlayerInfo[]
    {
        return this._players;
    }
}
