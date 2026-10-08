import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IYoutubeHubViewer
{
    id: number;
    name: string;
    look: string;
}

export interface IYoutubeHubEntry
{
    id: number;
    videoId: string;
    title: string;
    channel: string;
    duration: number;
    addedById: number;
    addedByName: string;
    addedByLook: string;
}

/** BobbaTok (9824) : etat du hub YouTube de l'appart (propre au joueur : droits + vote). */
export class YoutubeHubStateMessageParser implements IMessageParser
{
    private static readonly MAX_LIST = 1000;

    private _canManage: boolean;
    private _playing: boolean;
    private _currentEntryId: number;
    private _elapsedMs: number;
    private _likes: number;
    private _dislikes: number;
    private _myVote: number;
    private _viewers: IYoutubeHubViewer[];
    private _entries: IYoutubeHubEntry[];

    public flush(): boolean
    {
        this._canManage = false;
        this._playing = false;
        this._currentEntryId = -1;
        this._elapsedMs = 0;
        this._likes = 0;
        this._dislikes = 0;
        this._myVote = 0;
        this._viewers = [];
        this._entries = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._canManage = wrapper.readBoolean();
        this._playing = wrapper.readBoolean();
        this._currentEntryId = wrapper.readInt();
        this._elapsedMs = wrapper.readInt();
        this._likes = wrapper.readInt();
        this._dislikes = wrapper.readInt();
        this._myVote = wrapper.readInt();

        const viewerCount = wrapper.readInt();

        if((viewerCount < 0) || (viewerCount > YoutubeHubStateMessageParser.MAX_LIST)) return false;

        for(let index = 0; index < viewerCount; index++)
        {
            const id = wrapper.readInt();
            const name = wrapper.readString();
            const look = wrapper.readString();

            this._viewers.push({ id, name, look });
        }

        const entryCount = wrapper.readInt();

        if((entryCount < 0) || (entryCount > YoutubeHubStateMessageParser.MAX_LIST)) return false;

        for(let index = 0; index < entryCount; index++)
        {
            const id = wrapper.readInt();
            const videoId = wrapper.readString();
            const title = wrapper.readString();
            const channel = wrapper.readString();
            const duration = wrapper.readInt();
            const addedById = wrapper.readInt();
            const addedByName = wrapper.readString();
            const addedByLook = wrapper.readString();

            this._entries.push({ id, videoId, title, channel, duration, addedById, addedByName, addedByLook });
        }

        return true;
    }

    public get canManage(): boolean { return this._canManage; }
    public get playing(): boolean { return this._playing; }
    public get currentEntryId(): number { return this._currentEntryId; }
    public get elapsedMs(): number { return this._elapsedMs; }
    public get likes(): number { return this._likes; }
    public get dislikes(): number { return this._dislikes; }
    public get myVote(): number { return this._myVote; }
    public get viewers(): IYoutubeHubViewer[] { return this._viewers; }
    public get entries(): IYoutubeHubEntry[] { return this._entries; }
}
