import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RocketEndParser } from '../../../parser';

export class RocketEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RocketEndParser);
    }

    public getParser(): RocketEndParser
    {
        return this.parser as RocketEndParser;
    }
}
