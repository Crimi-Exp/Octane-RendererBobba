import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BattleBallGameStartParser } from '../../../parser';

export class BattleBallGameStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BattleBallGameStartParser);
    }

    public getParser(): BattleBallGameStartParser
    {
        return this.parser as BattleBallGameStartParser;
    }
}
