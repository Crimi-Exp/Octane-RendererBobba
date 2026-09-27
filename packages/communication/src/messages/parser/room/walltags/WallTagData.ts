import { IMessageDataWrapper } from '@octane/api';

/** Un tag mural (graffiti) tel qu'envoye par l'emulateur. `data` est un PNG en base64 (sans prefixe data:). */
export class WallTagData
{
    private _id: number;
    private _userId: number;
    private _username: string;
    private _wallPosition: string;
    private _width: number;
    private _height: number;
    private _data: string;
    private _createdAt: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        this._id = wrapper.readInt();
        this._userId = wrapper.readInt();
        this._username = wrapper.readString();
        this._wallPosition = wrapper.readString();
        this._width = wrapper.readInt();
        this._height = wrapper.readInt();
        this._data = wrapper.readString();
        this._createdAt = wrapper.readInt();
    }

    public get id(): number
    {
        return this._id;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get username(): string
    {
        return this._username;
    }

    public get wallPosition(): string
    {
        return this._wallPosition;
    }

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }

    public get data(): string
    {
        return this._data;
    }

    public get createdAt(): number
    {
        return this._createdAt;
    }
}
