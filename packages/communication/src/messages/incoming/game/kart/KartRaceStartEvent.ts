import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { KartRaceStartParser } from '../../../parser';

export class KartRaceStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, KartRaceStartParser);
    }

    public getParser(): KartRaceStartParser
    {
        return this.parser as KartRaceStartParser;
    }
}
