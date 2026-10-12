import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { ManoirStateParser } from '../../../parser';

export class ManoirStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ManoirStateParser);
    }

    public getParser(): ManoirStateParser
    {
        return this.parser as ManoirStateParser;
    }
}
