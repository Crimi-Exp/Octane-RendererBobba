import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Une ligne du classement de l'appart (meilleur temps par joueur). */
export interface IManoirScore
{
    name: string;
    ms: number;
}

/**
 * Le Manoir : fin de partie pour moi (timeMs = -1 : simple demande de classement), mon meilleur temps (-1 si aucun),
 * mon rang (0 si aucun), badge gagne et le top 10 de l'appart.
 */
export class ManoirFinishParser implements IMessageParser
{
    private _timeMs: number;
    private _bestMs: number;
    private _rank: number;
    private _newBadge: boolean;
    private _top: IManoirScore[];

    public flush(): boolean
    {
        this._timeMs = -1;
        this._bestMs = -1;
        this._rank = 0;
        this._newBadge = false;
        this._top = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._timeMs = wrapper.readInt();
        this._bestMs = wrapper.readInt();
        this._rank = wrapper.readInt();
        this._newBadge = wrapper.readBoolean();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const name = wrapper.readString();
            const ms = wrapper.readInt();
            this._top.push({ name, ms });
        }

        return true;
    }

    public get timeMs(): number
    {
        return this._timeMs;
    }
    public get bestMs(): number
    {
        return this._bestMs;
    }
    public get rank(): number
    {
        return this._rank;
    }
    public get newBadge(): boolean
    {
        return this._newBadge;
    }
    public get top(): IManoirScore[]
    {
        return this._top;
    }
}
