import { IMessageDataWrapper } from '@octane/api';

export class SnowWarSubturnEventData
{
    public static EVENT_TYPE_AVATAR_MOVE = 2;
    public static EVENT_TYPE_CREATE_SNOWBALL = 3;
    public static EVENT_TYPE_LAUNCH_SNOWBALL = 4;
    public static EVENT_TYPE_HIT = 5;
    public static EVENT_TYPE_MACHINE_ADD_SNOWBALL = 11;
    public static EVENT_TYPE_MACHINE_TRANSFER_SNOWBALL = 12;
    public static EVENT_TYPE_DELETE_OBJECT = 8;
    public static EVENT_TYPE_STUN = 9;
    public static EVENT_TYPE_RAY_GUN_BURST = 10;
    public static EVENT_TYPE_TREE_HIT = 13;
    // BobbaTok : murs de neige, boule chargee, tir triple, bonus au sol
    public static EVENT_TYPE_WALL_ADD = 20;
    public static EVENT_TYPE_WALL_HIT = 21;
    public static EVENT_TYPE_LAUNCH_BIG = 22;
    public static EVENT_TYPE_LAUNCH_EXTRA = 23;
    public static EVENT_TYPE_BONUS_ADD = 24;
    public static EVENT_TYPE_BONUS_TAKE = 25;
    public static EVENT_TYPE_BUFF = 26;
    public static EVENT_TYPE_SHIELD_BLOCK = 27;

    private _eventType: number;
    private _objectId: number = -1;
    private _throwerObjectId: number = -1;
    private _targetObjectId: number = -1;
    private _targetX: number = 0;
    private _targetY: number = 0;
    private _trajectory: number = 0;
    private _direction: number = 0;
    private _machineObjectId: number = -1;
    private _avatarObjectId: number = -1;
    private _height: number = 0;
    private _state: number = 0;
    /** Champs des evenements BobbaTok (20 a 27), dans l'ordre d'envoi. */
    private _values: number[] = [];

    constructor(wrapper: IMessageDataWrapper)
    {
        this._eventType = wrapper.readInt();

        switch(this._eventType)
        {
            case SnowWarSubturnEventData.EVENT_TYPE_AVATAR_MOVE:
                this._objectId = wrapper.readInt();
                this._targetX = wrapper.readInt();
                this._targetY = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_CREATE_SNOWBALL:
                this._objectId = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_LAUNCH_SNOWBALL:
            case SnowWarSubturnEventData.EVENT_TYPE_RAY_GUN_BURST:
            case SnowWarSubturnEventData.EVENT_TYPE_LAUNCH_BIG:
            case SnowWarSubturnEventData.EVENT_TYPE_LAUNCH_EXTRA:
                this._objectId = wrapper.readInt();
                this._throwerObjectId = wrapper.readInt();
                this._targetX = wrapper.readInt();
                this._targetY = wrapper.readInt();
                this._trajectory = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_HIT:
                this._throwerObjectId = wrapper.readInt();
                this._targetObjectId = wrapper.readInt();
                this._direction = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_MACHINE_ADD_SNOWBALL:
                this._machineObjectId = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_MACHINE_TRANSFER_SNOWBALL:
                this._avatarObjectId = wrapper.readInt();
                this._machineObjectId = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_DELETE_OBJECT:
                this._objectId = wrapper.readInt();
                this._targetX = wrapper.readInt();
                this._targetY = wrapper.readInt();
                this._height = wrapper.readInt();
                this._trajectory = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_STUN:
                this._targetObjectId = wrapper.readInt();
                this._throwerObjectId = wrapper.readInt();
                this._direction = wrapper.readInt();
                break;
            case SnowWarSubturnEventData.EVENT_TYPE_TREE_HIT:
                this._targetX = wrapper.readInt();
                this._targetY = wrapper.readInt();
                this._state = wrapper.readInt();
                break;
            default: {
                // Nombre de champs des evenements BobbaTok
                const count = SnowWarSubturnEventData.EXTRA_FIELD_COUNTS[this._eventType] ?? 0;
                for(let i = 0; i < count; i++) this._values.push(wrapper.readInt());
                break;
            }
        }
        if(this._eventType === SnowWarSubturnEventData.EVENT_TYPE_LAUNCH_BIG || this._eventType === SnowWarSubturnEventData.EVENT_TYPE_LAUNCH_EXTRA)
        {
            this._values = [ this._objectId, this._throwerObjectId, this._targetX, this._targetY, this._trajectory ];
        }
    }

    /** Champs de chaque evenement BobbaTok : mur pose, mur touche, bonus pose, pris, bonus d'un avatar, bouclier. */
    private static EXTRA_FIELD_COUNTS: Record<number, number> = { 20: 6, 21: 2, 24: 4, 25: 3, 26: 6, 27: 2 };

    public get values(): number[]
    {
        return this._values;
    }

    public get eventType(): number
    {
        return this._eventType;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get throwerObjectId(): number
    {
        return this._throwerObjectId;
    }

    public get targetObjectId(): number
    {
        return this._targetObjectId;
    }

    public get targetX(): number
    {
        return this._targetX;
    }

    public get targetY(): number
    {
        return this._targetY;
    }

    public get trajectory(): number
    {
        return this._trajectory;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public get machineObjectId(): number
    {
        return this._machineObjectId;
    }

    public get avatarObjectId(): number
    {
        return this._avatarObjectId;
    }

    public get height(): number
    {
        return this._height;
    }

    public get state(): number
    {
        return this._state;
    }
}
