import { RoomEngineEvent } from './RoomEngineEvent';

/**
 * BobbaTok : tags muraux (graffitis).
 * WALL_CLICKED : en mode tag, l'utilisateur a clique sur un mur (wallLocation = position ":w=.. l=.. l").
 * TAG_CLICKED  : clic sur un tag existant (tagId).
 * MODE_CHANGED : le mode tag a ete active / desactive.
 */
export class RoomEngineWallTagEvent extends RoomEngineEvent
{
    public static WALL_CLICKED: string = 'REWTE_WALL_CLICKED';
    public static TAG_CLICKED: string = 'REWTE_TAG_CLICKED';
    public static MODE_CHANGED: string = 'REWTE_MODE_CHANGED';
    /** Peinture en direct sur le mur : x/y en px de la toile du mur, buttonDown = bouton enfonce, click = clic simple. */
    public static PAINT: string = 'REWTE_PAINT';

    private _wallLocation: string;
    private _direction: number;
    private _tagId: number;
    private _enabled: boolean;
    public x: number = 0;
    public y: number = 0;
    public buttonDown: boolean = false;
    public click: boolean = false;
    public onWall: boolean = false;

    constructor(type: string, roomId: number, wallLocation: string = '', direction: number = 0, tagId: number = 0, enabled: boolean = false)
    {
        super(type, roomId);

        this._wallLocation = wallLocation;
        this._direction = direction;
        this._tagId = tagId;
        this._enabled = enabled;
    }

    public get wallLocation(): string
    {
        return this._wallLocation;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public get tagId(): number
    {
        return this._tagId;
    }

    public get enabled(): boolean
    {
        return this._enabled;
    }
}
