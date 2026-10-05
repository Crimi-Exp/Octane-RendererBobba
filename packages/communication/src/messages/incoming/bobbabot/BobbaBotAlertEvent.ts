import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BobbaBotAlertParser } from '../../parser';

export class BobbaBotAlertEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BobbaBotAlertParser);
    }

    public getParser(): BobbaBotAlertParser
    {
        return this.parser as BobbaBotAlertParser;
    }
}
