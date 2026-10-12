import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { ManoirFinishParser } from '../../../parser';

export class ManoirFinishEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ManoirFinishParser);
    }

    public getParser(): ManoirFinishParser
    {
        return this.parser as ManoirFinishParser;
    }
}
