import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WhisperGroupUpdateParser } from '../../../../parser';

/** BobbaTok : le serveur met a jour l'etat du murmure en groupe. */
export class WhisperGroupUpdateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WhisperGroupUpdateParser);
    }

    public getParser(): WhisperGroupUpdateParser
    {
        return this.parser as WhisperGroupUpdateParser;
    }
}
