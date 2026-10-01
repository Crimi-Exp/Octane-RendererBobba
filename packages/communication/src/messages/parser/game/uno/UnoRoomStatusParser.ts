import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IUnoRoomStatus
{
    userId: number;
    /** id de l'avatar dans l'appart */
    unitId: number;
    /** 0 rien, 1 dans un salon, 2 en partie */
    status: number;
    freeSeats: number;
    /** la derniere carte posee (0 = aucune) */
    card: number;
}

/** Qui joue au UNO dans l'appart : liste complete ou mise a jour. */
export class UnoRoomStatusParser implements IMessageParser
{
    private _full: boolean;
    private _entries: IUnoRoomStatus[];

    public flush(): boolean
    {
        this._full = false;
        this._entries = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._full = wrapper.readInt() === 1;

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const userId = wrapper.readInt();
            const unitId = wrapper.readInt();
            const status = wrapper.readInt();
            const freeSeats = wrapper.readInt();
            const card = wrapper.readInt();
            this._entries.push({ userId, unitId, status, freeSeats, card });
        }

        return true;
    }

    public get full(): boolean
    {
        return this._full;
    }
    public get entries(): IUnoRoomStatus[]
    {
        return this._entries;
    }
}
