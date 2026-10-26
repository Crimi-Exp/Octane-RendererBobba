import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RocketStateParser } from '../../../parser';

export class RocketStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RocketStateParser);
    }

    public getParser(): RocketStateParser
    {
        return this.parser as RocketStateParser;
    }
}
