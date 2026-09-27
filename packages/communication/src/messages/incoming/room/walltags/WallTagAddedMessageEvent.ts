import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WallTagAddedMessageParser } from '../../../parser';

export class WallTagAddedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WallTagAddedMessageParser);
    }

    public getParser(): WallTagAddedMessageParser
    {
        return this.parser as WallTagAddedMessageParser;
    }
}
