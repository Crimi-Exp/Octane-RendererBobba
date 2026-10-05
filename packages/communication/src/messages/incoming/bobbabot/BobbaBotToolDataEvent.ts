import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BobbaBotToolDataParser } from '../../parser';

export class BobbaBotToolDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BobbaBotToolDataParser);
    }

    public getParser(): BobbaBotToolDataParser
    {
        return this.parser as BobbaBotToolDataParser;
    }
}
