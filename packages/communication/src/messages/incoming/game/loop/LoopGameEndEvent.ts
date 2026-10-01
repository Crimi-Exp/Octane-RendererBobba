import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { LoopGameEndParser } from '../../../parser';

export class LoopGameEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, LoopGameEndParser);
    }

    public getParser(): LoopGameEndParser
    {
        return this.parser as LoopGameEndParser;
    }
}
