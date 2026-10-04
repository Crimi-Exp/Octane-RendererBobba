import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IDuelPlayerInfo
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
    /** baguette choisie (0 a 3) */
    wand: number;
    /** enable de la baguette */
    effect: number;
}

/** Debut d'un Duel des Sorciers : duel, index du destinataire, allee (largeur, hauteur), temps, les deux joueurs. */
export class DuelStartParser implements IMessageParser
{
    private _matchId: number;
    private _yourIndex: number;
    private _width: number;
    private _height: number;
    private _countdownMs: number;
    private _fightMs: number;
    private _players: IDuelPlayerInfo[];

    public flush(): boolean
    {
        this._matchId = 0;
        this._yourIndex = -1;
        this._width = 11;
        this._height = 5;
        this._countdownMs = 0;
        this._fightMs = 0;
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._matchId = wrapper.readInt();
        this._yourIndex = wrapper.readInt();
        this._width = wrapper.readInt();
        this._height = wrapper.readInt();
        this._countdownMs = wrapper.readInt();
        this._fightMs = wrapper.readInt();
        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._players.push({
                userId: wrapper.readInt(),
                name: wrapper.readString(),
                figure: wrapper.readString(),
                gender: wrapper.readString(),
                bot: wrapper.readBoolean(),
                wand: wrapper.readInt(),
                effect: wrapper.readInt()
            });
        }

        return true;
    }

    public get matchId(): number
    {
        return this._matchId;
    }
    public get yourIndex(): number
    {
        return this._yourIndex;
    }
    public get width(): number
    {
        return this._width;
    }
    public get height(): number
    {
        return this._height;
    }
    public get countdownMs(): number
    {
        return this._countdownMs;
    }
    public get fightMs(): number
    {
        return this._fightMs;
    }
    public get players(): IDuelPlayerInfo[]
    {
        return this._players;
    }
}
