// BobbaTok : glace de patinoire (es_skating_ice) : les avatars qui sont dessus y ont un reflet inverse.
// Chaque mobi glace declare la zone qu'il couvre ; les avatars regardent s'ils sont dans une zone.
interface IIceArea
{
    roomId: string;
    x: number;
    y: number;
    sizeX: number;
    sizeY: number;
}

export class IceReflectionState
{
    private static _areas: Map<object, IIceArea> = new Map();

    public static isIceType(type: string): boolean
    {
        return !!type && type.startsWith('es_skating_ice');
    }

    public static setArea(owner: object, roomId: string, x: number, y: number, sizeX: number, sizeY: number): void
    {
        const existing = this._areas.get(owner);

        if(existing && (existing.roomId === roomId) && (existing.x === x) && (existing.y === y) && (existing.sizeX === sizeX) && (existing.sizeY === sizeY)) return;

        this._areas.set(owner, { roomId, x, y, sizeX, sizeY });
    }

    public static removeArea(owner: object): void
    {
        this._areas.delete(owner);
    }

    public static get hasAreas(): boolean
    {
        return (this._areas.size > 0);
    }

    public static getAreas(roomId: string): { x: number; y: number; sizeX: number; sizeY: number }[]
    {
        const areas: { x: number; y: number; sizeX: number; sizeY: number }[] = [];

        for(const area of this._areas.values())
        {
            if(roomId && area.roomId && (area.roomId !== roomId)) continue;

            areas.push(area);
        }

        return areas;
    }

    public static isOnIce(roomId: string, x: number, y: number): boolean
    {
        if(!this._areas.size) return false;

        const tileX = Math.round(x);
        const tileY = Math.round(y);

        for(const area of this._areas.values())
        {
            if(roomId && area.roomId && (area.roomId !== roomId)) continue;

            if((tileX >= area.x) && (tileX < (area.x + area.sizeX)) && (tileY >= area.y) && (tileY < (area.y + area.sizeY))) return true;
        }

        return false;
    }
}
