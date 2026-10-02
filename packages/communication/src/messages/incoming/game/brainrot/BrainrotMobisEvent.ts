import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BrainrotMobisParser } from '../../../parser';

export class BrainrotMobisEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BrainrotMobisParser);
    }

    public getParser(): BrainrotMobisParser
    {
        return this.parser as BrainrotMobisParser;
    }
}
