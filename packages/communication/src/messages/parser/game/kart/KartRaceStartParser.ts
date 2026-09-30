import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IKartRacerData
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    isBot: boolean;
    /** 0 Mario, 1 Luigi, 2 Peach, 3 Toad, 4 Wario */
    kart: number;
    /** effet (enable) qui dessine le kart autour de l'avatar */
    effect: number;
}

/**
 * Depart d'une course BobbaKart : le circuit (ligne centrale et boites, en cases), les reglages de conduite
 * (pour prevoir son propre kart comme le serveur) et les pilotes.
 */
export class KartRaceStartParser implements IMessageParser
{
    private _raceId: number;
    private _trackId: number;
    private _laps: number;
    private _yourIndex: number;
    private _countdownMs: number;
    private _points: [number, number][];
    private _boxes: [number, number][];
    private _physics: number[];
    private _racers: IKartRacerData[];

    public flush(): boolean
    {
        this._raceId = 0;
        this._trackId = 0;
        this._laps = 0;
        this._yourIndex = 0;
        this._countdownMs = 0;
        this._points = [];
        this._boxes = [];
        this._physics = [];
        this._racers = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._raceId = wrapper.readInt();
        this._trackId = wrapper.readInt();
        this._laps = wrapper.readInt();
        this._yourIndex = wrapper.readInt();
        this._countdownMs = wrapper.readInt();

        let count = wrapper.readInt();
        for(let i = 0; i < count; i++) this._points.push([ wrapper.readInt() / 1000, wrapper.readInt() / 1000 ]);

        count = wrapper.readInt();
        for(let i = 0; i < count; i++) this._boxes.push([ wrapper.readInt() / 1000, wrapper.readInt() / 1000 ]);

        count = wrapper.readInt();
        for(let i = 0; i < count; i++) this._physics.push(wrapper.readInt() / 1000);

        count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._racers.push({
                userId: wrapper.readInt(),
                name: wrapper.readString(),
                figure: wrapper.readString(),
                gender: wrapper.readString(),
                isBot: wrapper.readBoolean(),
                kart: wrapper.readInt(),
                effect: wrapper.readInt()
            });
        }

        return true;
    }

    public get raceId(): number
    {
        return this._raceId;
    }
    public get trackId(): number
    {
        return this._trackId;
    }
    public get laps(): number
    {
        return this._laps;
    }
    public get yourIndex(): number
    {
        return this._yourIndex;
    }
    public get countdownMs(): number
    {
        return this._countdownMs;
    }
    public get points(): [number, number][]
    {
        return this._points;
    }
    public get boxes(): [number, number][]
    {
        return this._boxes;
    }
    public get physics(): number[]
    {
        return this._physics;
    }
    public get racers(): IKartRacerData[]
    {
        return this._racers;
    }
}
