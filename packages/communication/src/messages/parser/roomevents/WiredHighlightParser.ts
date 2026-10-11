import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface WiredHighlightUpdate
{
    /** 0 mobi au sol, 1 mobi mural, 2 avatar. */
    kind: number;
    /** Id du mobi, ou id d'unite de la piece (roomIndex de l'avatar, a partir de 0). */
    id: number;
    /** Couleur 0xRRGGBB, ou -1 quand la surbrillance est eteinte. */
    color: number;
}

/**
 * wf_act_set_highlight (header 5113) : surbrillance coloree des mobis et des avatars pour toute la piece.
 * int version, int roomId, int count, puis par objet : int type, int id, int couleur (-1 = eteinte).
 */
export class WiredHighlightParser implements IMessageParser
{
    public static readonly PROTOCOL_VERSION = 1;
    public static readonly MAXIMUM_UPDATES = 2000;
    public static readonly KIND_FLOOR = 0;
    public static readonly KIND_WALL = 1;
    public static readonly KIND_UNIT = 2;
    public static readonly OFF = -1;
    private static readonly HEADER_BYTES = 12;
    private static readonly UPDATE_BYTES = 12;

    private _protocolVersion = 0;
    private _roomId = 0;
    private _updates: WiredHighlightUpdate[] = [];

    public flush(): boolean
    {
        this._protocolVersion = 0;
        this._roomId = 0;
        this._updates = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        this.flush();
        if(!wrapper || !this.hasBytes(wrapper, WiredHighlightParser.HEADER_BYTES)) return false;

        this._protocolVersion = wrapper.readInt();
        this._roomId = wrapper.readInt();
        const count = wrapper.readInt();

        if(this._protocolVersion !== WiredHighlightParser.PROTOCOL_VERSION) return false;
        if((this._roomId < 0) || (count < 0) || (count > WiredHighlightParser.MAXIMUM_UPDATES)) return false;
        if(!this.hasBytes(wrapper, count * WiredHighlightParser.UPDATE_BYTES)) return false;

        const updates: WiredHighlightUpdate[] = [];

        for(let index = 0; index < count; index++)
        {
            const kind = wrapper.readInt();
            const id = wrapper.readInt();
            const color = wrapper.readInt();

            if((kind < WiredHighlightParser.KIND_FLOOR) || (kind > WiredHighlightParser.KIND_UNIT) || (id < 0)) return false;

            updates.push({ kind, id, color: (color < 0) ? WiredHighlightParser.OFF : (color & 0xFFFFFF) });
        }

        this._updates = updates;
        return true;
    }

    private hasBytes(wrapper: IMessageDataWrapper, required: number): boolean
    {
        if(required <= 0) return true;
        if(typeof wrapper.remainingBytes === 'number') return wrapper.remainingBytes >= required;
        return wrapper.bytesAvailable;
    }

    public get protocolVersion(): number
    {
        return this._protocolVersion;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get updates(): readonly WiredHighlightUpdate[]
    {
        return this._updates;
    }
}
