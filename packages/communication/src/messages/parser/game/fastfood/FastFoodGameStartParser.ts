import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IFastFoodPlayerInfo
{
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
}

/** Debut d'une partie FastFood : id, ton index, compte a rebours (ms), duree (ms), plats pour gagner, joueurs. */
export class FastFoodGameStartParser implements IMessageParser
{
    private _gameId: number;
    private _yourIndex: number;
    private _countdownMs: number;
    private _gameMs: number;
    private _stars: number;
    private _players: IFastFoodPlayerInfo[];

    public flush(): boolean
    {
        this._gameId = 0;
        this._yourIndex = -1;
        this._countdownMs = 0;
        this._gameMs = 0;
        this._stars = 6;
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._gameId = wrapper.readInt();
        this._yourIndex = wrapper.readInt();
        this._countdownMs = wrapper.readInt();
        this._gameMs = wrapper.readInt();
        this._stars = wrapper.readInt();

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
    public get countdownMs(): number
    {
        return this._countdownMs;
    }
    public get gameMs(): number
    {
        return this._gameMs;
    }
    public get stars(): number
    {
        return this._stars;
    }
    public get players(): IFastFoodPlayerInfo[]
    {
        return this._players;
    }
}
