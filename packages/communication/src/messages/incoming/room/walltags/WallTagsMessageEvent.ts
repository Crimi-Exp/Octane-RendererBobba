import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WallTagsMessageParser } from '../../../parser';

export class WallTagsMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WallTagsMessageParser);
    }

    public getParser(): WallTagsMessageParser
    {
        return this.parser as WallTagsMessageParser;
    }
}
