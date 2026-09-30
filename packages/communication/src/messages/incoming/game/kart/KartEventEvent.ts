import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { KartEventParser } from '../../../parser';

export class KartEventEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, KartEventParser);
    }

    public getParser(): KartEventParser
    {
        return this.parser as KartEventParser;
    }
}
