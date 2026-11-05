import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface WhisperGroupMember
{
    id: number;
    name: string;
}

/** BobbaTok : etat du murmure en groupe (liste des membres). Liste vide = groupe dissous. */
export class WhisperGroupUpdateParser implements IMessageParser
{
    private _members: WhisperGroupMember[];

    public flush(): boolean
    {
        this._members = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._members = [];
        const total = wrapper.readInt();

        for(let i = 0; i < total; i++)
        {
            const id = wrapper.readInt();
            const name = wrapper.readString();
            this._members.push({ id, name });
        }

        return true;
    }

    public get members(): WhisperGroupMember[]
    {
        return this._members;
    }
}
