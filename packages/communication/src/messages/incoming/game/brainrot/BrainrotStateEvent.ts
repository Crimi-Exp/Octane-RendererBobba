import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BrainrotStateParser } from '../../../parser';

export class BrainrotStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BrainrotStateParser);
    }

    public getParser(): BrainrotStateParser
    {
        return this.parser as BrainrotStateParser;
    }
}
