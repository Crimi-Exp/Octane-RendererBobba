import { ObjectStateUpdateMessage } from './ObjectStateUpdateMessage';

/** Official `RoomObjectAvatarBlockedUpdateMessage`: the session blocks (or stops blocking) this player. */
export class ObjectAvatarBlockedUpdateMessage extends ObjectStateUpdateMessage
{
    private _isBlocked: boolean;

    constructor(isBlocked: boolean = false)
    {
        super();

        this._isBlocked = isBlocked;
    }

    public get isBlocked(): boolean
    {
        return this._isBlocked;
    }
}
