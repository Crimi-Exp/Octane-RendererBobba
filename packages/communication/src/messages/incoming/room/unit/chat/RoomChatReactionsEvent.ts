import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RoomChatReactionsParser } from '../../../../parser';

/** BobbaTok : le serveur diffuse les compteurs de reactions d'un message de tchat. */
export class RoomChatReactionsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomChatReactionsParser);
    }

    public getParser(): RoomChatReactionsParser
    {
        return this.parser as RoomChatReactionsParser;
    }
}
