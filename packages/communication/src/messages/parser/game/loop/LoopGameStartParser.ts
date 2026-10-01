import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface ILoopCarInfo
{
    name: string;
    figure: string;
    gender: string;
    bot: boolean;
}

/**
 * Depart d'une course Bobba Loop : id, ton index, compte a rebours (ms), duree max (ms), piste (id, nom, sol,
 * index de l'arrivee, puis chaque point : x, y en dixiemes et bits : 1 booster, 2 reprise, 4 fin avant un saut,
 * 8 arrivee, 16 debut apres un saut), puis les voitures.
 */
export class LoopGameStartParser implements IMessageParser
{
    private _gameId: number;
    private _yourIndex: number;
    private _countdownMs: number;
    private _gameMs: number;
    private _trackId: number;
    private _trackName: string;
    private _ground: number;
    private _finish: number;
    private _xs: Float32Array;
    private _ys: Float32Array;
    private _flags: Uint8Array;
    private _cars: ILoopCarInfo[];

    public flush(): boolean
    {
        this._gameId = 0;
        this._yourIndex = -1;
        this._countdownMs = 0;
        this._gameMs = 0;
        this._trackId = 0;
        this._trackName = '';
        this._ground = 0;
        this._finish = 0;
        this._xs = new Float32Array(0);
        this._ys = new Float32Array(0);
        this._flags = new Uint8Array(0);
        this._cars = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._gameId = wrapper.readInt();
        this._yourIndex = wrapper.readInt();
        this._countdownMs = wrapper.readInt();
        this._gameMs = wrapper.readInt();
        this._trackId = wrapper.readInt();
        this._trackName = wrapper.readString();
        this._ground = wrapper.readInt();
        this._finish = wrapper.readInt();
        const count = wrapper.readInt();
        this._xs = new Float32Array(count);
        this._ys = new Float32Array(count);
        this._flags = new Uint8Array(count);
        for(let i = 0; i < count; i++)
        {
            this._xs[i] = wrapper.readInt() / 10;
            this._ys[i] = wrapper.readInt() / 10;
            this._flags[i] = wrapper.readInt();
        }
        const cars = wrapper.readInt();
        for(let i = 0; i < cars; i++)
        {
            const name = wrapper.readString();
            const figure = wrapper.readString();
            const gender = wrapper.readString();
            const bot = wrapper.readBoolean();
            this._cars.push({ name, figure, gender, bot });
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
    public get trackId(): number
    {
        return this._trackId;
    }
    public get trackName(): string
    {
        return this._trackName;
    }
    public get ground(): number
    {
        return this._ground;
    }
    public get finish(): number
    {
        return this._finish;
    }
    public get xs(): Float32Array
    {
        return this._xs;
    }
    public get ys(): Float32Array
    {
        return this._ys;
    }
    public get flags(): Uint8Array
    {
        return this._flags;
    }
    public get cars(): ILoopCarInfo[]
    {
        return this._cars;
    }
}
