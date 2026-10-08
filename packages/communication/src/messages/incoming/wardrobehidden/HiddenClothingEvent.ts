import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { HiddenClothingMessageParser } from '../../parser';

export class HiddenClothingEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, HiddenClothingMessageParser);
    }

    public getParser(): HiddenClothingMessageParser
    {
        return this.parser as HiddenClothingMessageParser;
    }
}
