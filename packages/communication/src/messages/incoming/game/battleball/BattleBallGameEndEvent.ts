import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BattleBallGameEndParser } from '../../../parser';

export class BattleBallGameEndEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BattleBallGameEndParser);
    }

    public getParser(): BattleBallGameEndParser
    {
        return this.parser as BattleBallGameEndParser;
    }
}
