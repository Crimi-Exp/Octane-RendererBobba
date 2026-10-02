import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BrainrotLabelsParser } from '../../../parser';

export class BrainrotLabelsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BrainrotLabelsParser);
    }

    public getParser(): BrainrotLabelsParser
    {
        return this.parser as BrainrotLabelsParser;
    }
}
