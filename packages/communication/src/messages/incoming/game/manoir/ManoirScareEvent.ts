import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { ManoirScareParser } from '../../../parser';

export class ManoirScareEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ManoirScareParser);
    }

    public getParser(): ManoirScareParser
    {
        return this.parser as ManoirScareParser;
    }
}
