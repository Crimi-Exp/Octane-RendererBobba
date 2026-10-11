import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredUnitOpacityParser } from '../../parser';

export class WiredUnitOpacityEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredUnitOpacityParser);
    }

    public getParser(): WiredUnitOpacityParser
    {
        return this.parser as WiredUnitOpacityParser;
    }
}
