import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IUnoTableMember
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
}

/** Salon UNO : id (0 = pas de salon), id de l'hote, places, bots, joueurs. */
export class UnoTableParser implements IMessageParser
{
    private _tableId: number;
    private _hostId: number;
    private _seats: number;
    private _bots: boolean;
    private _members: IUnoTableMember[];

    public flush(): boolean
    {
        this._tableId = 0;
        this._hostId = 0;
        this._seats = 0;
        this._bots = false;
        this._members = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._tableId = wrapper.readInt();
        this._hostId = wrapper.readInt();
        this._seats = wrapper.readInt();
        this._bots = wrapper.readInt() === 1;

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const userId = wrapper.readInt();
            const name = wrapper.readString();
            const figure = wrapper.readString();
            const gender = wrapper.readString();
            this._members.push({ userId, name, figure, gender });
        }

        return true;
    }

    public get tableId(): number
    {
        return this._tableId;
    }
    public get hostId(): number
    {
        return this._hostId;
    }
    public get seats(): number
    {
        return this._seats;
    }
    public get bots(): boolean
    {
        return this._bots;
    }
    public get members(): IUnoTableMember[]
    {
        return this._members;
    }
}
