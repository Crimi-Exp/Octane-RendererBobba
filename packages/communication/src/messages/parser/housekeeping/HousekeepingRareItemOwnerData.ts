import { IMessageDataWrapper } from '@octane/api';

export class HousekeepingRareItemOwnerData
{
    private _userId: number = 0;
    private _username: string = '';
    private _look: string = '';
    private _quantity: number = 0;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this._userId = wrapper.readInt();
        this._username = wrapper.readString();
        this._look = wrapper.readString();
        this._quantity = wrapper.readInt();
    }

    public get userId(): number
    {
        return this._userId;
    }
    public get username(): string
    {
        return this._username;
    }
    public get look(): string
    {
        return this._look;
    }
    public get quantity(): number
    {
        return this._quantity;
    }
}