import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IRocketPlayerState
{
    x: number;
    y: number;
    z: number;
    heading: number;
    speed: number;
    boost: number;
    /** 1 boost, 2 supersonique, 4 demoli, 8 en l'air, 16 parti, 32 bot */
    flags: number;
    goals: number;
}

/** Rocket Bobba : etat du match, 20 fois par seconde. */
export class RocketStateParser implements IMessageParser
{
    private _phase: number;
    private _clockMs: number;
    private _kickoffLeftMs: number;
    private _blue: number;
    private _orange: number;
    private _ball: number[];
    private _players: IRocketPlayerState[];
    private _padMask: number;

    public flush(): boolean
    {
        this._phase = 0;
        this._clockMs = 0;
        this._kickoffLeftMs = 0;
        this._blue = 0;
        this._orange = 0;
        this._ball = [];
        this._players = [];
        this._padMask = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._phase = wrapper.readInt();
        this._clockMs = wrapper.readInt();
        this._kickoffLeftMs = wrapper.readInt();
        this._blue = wrapper.readInt();
        this._orange = wrapper.readInt();
        for(let i = 0; i < 6; i++) this._ball.push(wrapper.readInt() / 1000);

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._players.push({
                x: wrapper.readInt() / 1000,
                y: wrapper.readInt() / 1000,
                z: wrapper.readInt() / 1000,
                heading: wrapper.readInt() / 1000,
                speed: wrapper.readInt() / 1000,
                boost: wrapper.readInt(),
                flags: wrapper.readInt(),
                goals: wrapper.readInt()
            });
        }

        this._padMask = wrapper.readInt();

        return true;
    }

    public get phase(): number
    {
        return this._phase;
    }
    public get clockMs(): number
    {
        return this._clockMs;
    }
    public get kickoffLeftMs(): number
    {
        return this._kickoffLeftMs;
    }
    public get blue(): number
    {
        return this._blue;
    }
    public get orange(): number
    {
        return this._orange;
    }
    public get ball(): number[]
    {
        return this._ball;
    }
    public get players(): IRocketPlayerState[]
    {
        return this._players;
    }
    public get padMask(): number
    {
        return this._padMask;
    }
}
