import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WobbleMatchEndParser } from '../../../parser';

export class WobbleMatchEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WobbleMatchEndParser);
    }

    public getParser(): WobbleMatchEndParser
    {
        return this.parser as WobbleMatchEndParser;
    }
}
