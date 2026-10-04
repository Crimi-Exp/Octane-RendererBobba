import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { CollectiblesDataParser } from '../../parser';

export class CollectiblesDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CollectiblesDataParser);
    }

    public getParser(): CollectiblesDataParser
    {
        return this.parser as CollectiblesDataParser;
    }
}
