import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { LoopGameStartParser } from '../../../parser';

export class LoopGameStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, LoopGameStartParser);
    }

    public getParser(): LoopGameStartParser
    {
        return this.parser as LoopGameStartParser;
    }
}
