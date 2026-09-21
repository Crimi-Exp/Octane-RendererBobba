/**
 * BobbaTok : preview de la hauteur de construction (:setz).
 * Quand `override` est défini, le fantôme du mobi en cours de placement/déplacement
 * est posé à sol + override au lieu du dessus de la pile.
 */
export class RoomBuildHeightPreview
{
    public static override: number | null = null;
    public static maxHeight = 40;

    private static _width = 0;
    private static _height = 0;
    private static _floor: number[] = [];

    public static resetFloor(width: number, height: number): void
    {
        this._width = width;
        this._height = height;
        this._floor = new Array(width * height).fill(0);
    }

    public static setFloor(x: number, y: number, z: number): void
    {
        if(x < 0 || y < 0 || x >= this._width || y >= this._height) return;
        this._floor[(y * this._width) + x] = z;
    }

    public static getFloor(x: number, y: number): number
    {
        if(x < 0 || y < 0 || x >= this._width || y >= this._height) return 0;
        return this._floor[(y * this._width) + x] || 0;
    }

    public static previewZ(x: number, y: number): number
    {
        // BobbaTok : hauteur ABSOLUE (independante du sol) -> :setz 0.8 = z 0.8 meme sur un sol a 4
        return Math.max(-this.maxHeight, Math.min(this.override ?? this.getFloor(x, y), this.maxHeight));
    }
}
