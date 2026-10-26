import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IRocketPad
{
    x: number;
    y: number;
    big: boolean;
}

export interface IRocketPlayerData
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
    /** 0 bleus, 1 oranges */
    team: number;
    car: number;
    effect: number;
}

/** Rocket Bobba : debut du match (reglages physiques, pastilles de boost, joueurs). */
export class RocketMatchStartParser implements IMessageParser
{
    private _matchId: number;
    private _yourIndex: number;
    private _teamSize: number;
    private _clockMs: number;
    private _kickoffMs: number;
    private _physics: number[];
    private _pads: IRocketPad[];
    private _players: IRocketPlayerData[];

    public flush(): boolean
    {
        this._matchId = 0;
        this._yourIndex = 0;
        this._teamSize = 0;
        this._clockMs = 0;
        this._kickoffMs = 0;
        this._physics = [];
        this._pads = [];
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._matchId = wrapper.readInt();
        this._yourIndex = wrapper.readInt();
        this._teamSize = wrapper.readInt();
        this._clockMs = wrapper.readInt();
        this._kickoffMs = wrapper.readInt();

        let count = wrapper.readInt();
        for(let i = 0; i < count; i++) this._physics.push(wrapper.readInt() / 1000);

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._pads.push({ x: wrapper.readInt() / 1000, y: wrapper.readInt() / 1000, big: wrapper.readInt() === 1 });
        }

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._players.push({
                userId: wrapper.readInt(),
                name: wrapper.readString(),
                figure: wrapper.readString(),
                gender: wrapper.readString(),
                bot: wrapper.readBoolean(),
                team: wrapper.readInt(),
                car: wrapper.readInt(),
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
    public get teamSize(): number
    {
        return this._teamSize;
    }
    public get clockMs(): number
    {
        return this._clockMs;
    }
    public get kickoffMs(): number
    {
        return this._kickoffMs;
    }
    public get physics(): number[]
    {
        return this._physics;
    }
    public get pads(): IRocketPad[]
    {
        return this._pads;
    }
    public get players(): IRocketPlayerData[]
    {
        return this._players;
    }
}
