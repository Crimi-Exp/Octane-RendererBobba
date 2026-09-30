import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BattleBallStateParser } from '../../../parser';

export class BattleBallStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BattleBallStateParser);
    }

    public getParser(): BattleBallStateParser
    {
        return this.parser as BattleBallStateParser;
    }
}
