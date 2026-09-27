import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WallTagRemovedMessageParser } from '../../../parser';

export class WallTagRemovedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WallTagRemovedMessageParser);
    }

    public getParser(): WallTagRemovedMessageParser
    {
        return this.parser as WallTagRemovedMessageParser;
    }
}
