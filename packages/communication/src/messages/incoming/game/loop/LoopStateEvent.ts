import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { LoopStateParser } from '../../../parser';

export class LoopStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, LoopStateParser);
    }

    public getParser(): LoopStateParser
    {
        return this.parser as LoopStateParser;
    }
}
