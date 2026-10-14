import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RoomUnitGamePresenceParser } from '../../../parser';

export class RoomUnitGamePresenceEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomUnitGamePresenceParser);
    }

    public getParser(): RoomUnitGamePresenceParser
    {
        return this.parser as RoomUnitGamePresenceParser;
    }
}
