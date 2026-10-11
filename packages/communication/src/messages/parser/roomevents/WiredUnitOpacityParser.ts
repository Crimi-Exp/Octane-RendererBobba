import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface WiredUnitOpacityUpdate
{
    /** Id d'unite de la piece (roomIndex de l'avatar). */
    unitId: number;
    /** 0 (invisible) a 100 (normal). */
    opacity: number;
}

/**
 * wf_act_set_visibility (header 5112) : opacite des avatars pour toute la piece.
 * int version, int roomId, int count, puis par avatar : int unitId, int opacite 0-100.
 */
export class WiredUnitOpacityParser implements IMessageParser
{
    public static readonly PROTOCOL_VERSION = 1;
    public static readonly MAXIMUM_UPDATES = 2000;
    private static readonly HEADER_BYTES = 12;
    private static readonly UPDATE_BYTES = 8;

    private _protocolVersion = 0;
    private _roomId = 0;
    private _updates: WiredUnitOpacityUpdate[] = [];

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
        if(!wrapper || !this.hasBytes(wrapper, WiredUnitOpacityParser.HEADER_BYTES)) return false;

        this._protocolVersion = wrapper.readInt();
        this._roomId = wrapper.readInt();
        const count = wrapper.readInt();

        if(this._protocolVersion !== WiredUnitOpacityParser.PROTOCOL_VERSION) return false;
        if((this._roomId < 0) || (count < 0) || (count > WiredUnitOpacityParser.MAXIMUM_UPDATES)) return false;
        if(!this.hasBytes(wrapper, count * WiredUnitOpacityParser.UPDATE_BYTES)) return false;

        const updates: WiredUnitOpacityUpdate[] = [];

        for(let index = 0; index < count; index++)
        {
            const unitId = wrapper.readInt();
            const opacity = wrapper.readInt();

            if(unitId < 0) return false;

            updates.push({ unitId, opacity: Math.max(0, Math.min(100, opacity)) });
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

    public get updates(): readonly WiredUnitOpacityUpdate[]
    {
        return this._updates;
    }
}
