import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { KartRaceEndParser } from '../../../parser';

export class KartRaceEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, KartRaceEndParser);
    }

    public getParser(): KartRaceEndParser
    {
        return this.parser as KartRaceEndParser;
    }
}
