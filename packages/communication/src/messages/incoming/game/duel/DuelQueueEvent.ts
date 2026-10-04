import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { DuelIntsParser } from '../../../parser';

/** Duel des Sorciers : paquet d'entiers (Queue). */
export class DuelQueueEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, DuelIntsParser);
    }

    public getParser(): DuelIntsParser
    {
        return this.parser as DuelIntsParser;
    }
}
