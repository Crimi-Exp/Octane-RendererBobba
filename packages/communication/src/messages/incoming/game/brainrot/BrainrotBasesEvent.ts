import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BrainrotBasesParser } from '../../../parser';

export class BrainrotBasesEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BrainrotBasesParser);
    }

    public getParser(): BrainrotBasesParser
    {
        return this.parser as BrainrotBasesParser;
    }
}
