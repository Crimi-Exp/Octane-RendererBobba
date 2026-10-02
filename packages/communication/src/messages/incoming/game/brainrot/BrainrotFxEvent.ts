import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BrainrotFxParser } from '../../../parser';

export class BrainrotFxEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BrainrotFxParser);
    }

    public getParser(): BrainrotFxParser
    {
        return this.parser as BrainrotFxParser;
    }
}
