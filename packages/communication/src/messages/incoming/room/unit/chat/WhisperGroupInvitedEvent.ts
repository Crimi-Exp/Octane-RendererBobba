import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WhisperGroupInvitedParser } from '../../../../parser';

/** BobbaTok : invitation recue a rejoindre un murmure en groupe. */
export class WhisperGroupInvitedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WhisperGroupInvitedParser);
    }

    public getParser(): WhisperGroupInvitedParser
    {
        return this.parser as WhisperGroupInvitedParser;
    }
}
