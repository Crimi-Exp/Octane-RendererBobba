import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UnoRoomStatusParser } from '../../../parser';

export class UnoRoomStatusEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UnoRoomStatusParser);
    }

    public getParser(): UnoRoomStatusParser
    {
        return this.parser as UnoRoomStatusParser;
    }
}
