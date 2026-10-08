import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** BobbaTok (9826) : int userId, string look, bool like (tete qui monte sur la video). */
export class YoutubeHubReactionMessageParser implements IMessageParser
{
    private _userId: number;
    private _look: string;
    private _like: boolean;

    public flush(): boolean
    {
        this._userId = 0;
        this._look = '';
        this._like = true;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._userId = wrapper.readInt();
        this._look = wrapper.readString();
        this._like = wrapper.readBoolean();

        return true;
    }

    public get userId(): number { return this._userId; }
    public get look(): string { return this._look; }
    public get like(): boolean { return this._like; }
}
