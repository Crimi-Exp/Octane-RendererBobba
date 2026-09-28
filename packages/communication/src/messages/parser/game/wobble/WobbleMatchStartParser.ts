import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IWobblePlayerData
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    isBot: boolean;
}

/** Debut du duel : duree d'une manche, manches a gagner, camp du joueur (0 = gauche, 1 = droite) et les deux joueurs. */
export class WobbleMatchStartParser implements IMessageParser
{
    private _matchId: number;
    private _roundTime: number;
    private _winRounds: number;
    private _yourSide: number;
    private _players: IWobblePlayerData[];

    public flush(): boolean
    {
        this._matchId = 0;
        this._roundTime = 0;
        this._winRounds = 0;
        this._yourSide = 0;
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._matchId = wrapper.readInt();
        this._roundTime = wrapper.readInt();
        this._winRounds = wrapper.readInt();
        this._yourSide = wrapper.readInt();

        for(let i = 0; i < 2; i++)
        {
            this._players.push({
                userId: wrapper.readInt(),
                name: wrapper.readString(),
                figure: wrapper.readString(),
                gender: wrapper.readString(),
                isBot: wrapper.readBoolean()
            });
        }

        return true;
    }

    public get matchId(): number { return this._matchId; }
    public get roundTime(): number { return this._roundTime; }
    public get winRounds(): number { return this._winRounds; }
    public get yourSide(): number { return this._yourSide; }
    public get players(): IWobblePlayerData[] { return this._players; }
}
