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

    private _wallLocation: string;
    private _direction: number;
    private _tagId: number;
    private _enabled: boolean;

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
