import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** BobbaTok (9827) : int count, count x int roomId (apparts ou le hub YouTube joue). */
export class YoutubeHubRoomsMessageParser implements IMessageParser
{
    private static readonly MAX_ROOMS = 100000;

    private _roomIds: number[];

    public flush(): boolean
    {
        this._roomIds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();

        if((count < 0) || (count > YoutubeHubRoomsMessageParser.MAX_ROOMS)) return false;

        for(let index = 0; index < count; index++) this._roomIds.push(wrapper.readInt());

        return true;
    }

    public get roomIds(): number[] { return this._roomIds; }
}
