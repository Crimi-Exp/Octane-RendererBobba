import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { KartStateParser } from '../../../parser';

export class KartStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, KartStateParser);
    }

    public getParser(): KartStateParser
    {
        return this.parser as KartStateParser;
    }
}
