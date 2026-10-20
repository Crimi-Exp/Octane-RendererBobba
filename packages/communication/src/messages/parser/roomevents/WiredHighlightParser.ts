import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface WiredHighlightUpdate
{
    /** 0 mobi au sol, 1 mobi mural, 2 avatar. */
    kind: number;
    /** Id du mobi, ou id d'unite de la piece (roomIndex de l'avatar, a partir de 0). */
    id: number;
    /**
     * -1 quand la surbrillance est eteinte. Version 1 : couleur 0xRRGGBB. Version 2 : couleur + reglages Habbo
     * encodes au-dessus des 24 bits de couleur (cf. {@link WiredHighlightParser.encodeStyle}).
     */
    color: number;
}

/**
 * wf_act_set_highlight (header 5113) : surbrillance des mobis et des avatars.
 * int version, int roomId, int count, puis par objet :
 * - version 1 : int type d'objet, int id, int couleur (-1 = eteinte) ;
 * - version 2 (format Habbo) : int type d'objet, int id, int couleur (-1 = eteinte), int type de surbrillance
 *   (0 contour, 1 lueur douce, 2 assombrir, 3 teinte de couleur, 4 eclaircir, 5 aura neon), int intensite (0-100),
 *   int animation (0 fixe, 1 pulsation), int transition (0-4).
 */
export class WiredHighlightParser implements IMessageParser
{
    public static readonly PROTOCOL_VERSION = 1;
    public static readonly PROTOCOL_VERSION_STYLED = 2;
    public static readonly MAXIMUM_UPDATES = 2000;
    public static readonly KIND_FLOOR = 0;
    public static readonly KIND_WALL = 1;
    public static readonly KIND_UNIT = 2;
    public static readonly OFF = -1;
    private static readonly HEADER_BYTES = 12;
    private static readonly UPDATE_BYTES = 12;
    private static readonly STYLED_UPDATE_BYTES = 28;
    private static readonly STYLE_BASE = 0x1000000;

    private _protocolVersion = 0;
    private _roomId = 0;
    private _updates: WiredHighlightUpdate[] = [];

    /** Meme encodage que WiredHighlightFilters.encode (paquet room). */
    public static encodeStyle(color: number, type: number, strength: number, animation: number, easing: number): number
    {
        strength = Math.max(0, Math.min(100, strength));

        if((color < 0) || (strength <= 0)) return WiredHighlightParser.OFF;

        const code = 1 + Math.max(0, Math.min(5, type)) + (8 * strength) + (1024 * ((animation === 1) ? 1 : 0)) + (2048 * Math.max(0, Math.min(4, easing)));

        return ((color & 0xFFFFFF) + (code * WiredHighlightParser.STYLE_BASE));
    }

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
        const styled = (this._protocolVersion === WiredHighlightParser.PROTOCOL_VERSION_STYLED);

        if(!styled && (this._protocolVersion !== WiredHighlightParser.PROTOCOL_VERSION)) return false;
        if((this._roomId < 0) || (count < 0) || (count > WiredHighlightParser.MAXIMUM_UPDATES)) return false;
        if(!this.hasBytes(wrapper, count * (styled ? WiredHighlightParser.STYLED_UPDATE_BYTES : WiredHighlightParser.UPDATE_BYTES))) return false;

        const updates: WiredHighlightUpdate[] = [];

        for(let index = 0; index < count; index++)
        {
            const kind = wrapper.readInt();
            const id = wrapper.readInt();
            const color = wrapper.readInt();

            if((kind < WiredHighlightParser.KIND_FLOOR) || (kind > WiredHighlightParser.KIND_UNIT) || (id < 0)) return false;

            if(styled)
            {
                const type = wrapper.readInt();
                const strength = wrapper.readInt();
                const animation = wrapper.readInt();
                const easing = wrapper.readInt();

                updates.push({ kind, id, color: WiredHighlightParser.encodeStyle(color, type, strength, animation, easing) });
                continue;
            }

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
