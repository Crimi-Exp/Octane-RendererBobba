import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RocketEventParser } from '../../../parser';

export class RocketEventEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RocketEventParser);
    }

    public getParser(): RocketEventParser
    {
        return this.parser as RocketEventParser;
    }
}
