import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** BobbaTok : invitation recue a rejoindre un murmure en groupe. */
export class WhisperGroupInvitedParser implements IMessageParser
{
    private _fromId: number;
    private _fromName: string;

    public flush(): boolean
    {
        this._fromId = 0;
        this._fromName = '';
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._fromId = wrapper.readInt();
        this._fromName = wrapper.readString();

        return true;
    }

    public get fromId(): number
    {
        return this._fromId;
    }

    public get fromName(): string
    {
        return this._fromName;
    }
}
