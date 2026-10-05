import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Une ligne du journal de BobbaBot (infraction, pardon ou modification du staff). */
export interface IBobbaBotLogEntry
{
    id: number;
    userId: number;
    username: string;
    context: string;
    message: string;
    matched: string;
    kind: string;
    points: number;
    action: string;
    createdAt: number;
}

export const readBobbaBotLogEntry = (wrapper: IMessageDataWrapper): IBobbaBotLogEntry => ({
    id: wrapper.readInt(),
    userId: wrapper.readInt(),
    username: wrapper.readString(),
    context: wrapper.readString(),
    message: wrapper.readString(),
    matched: wrapper.readString(),
    kind: wrapper.readString(),
    points: wrapper.readInt(),
    action: wrapper.readString(),
    createdAt: wrapper.readInt()
});

/** Infraction en direct, envoyee au staff qui gere BobbaBot. */
export class BobbaBotAlertParser implements IMessageParser
{
    private _entry: IBobbaBotLogEntry = null;

    public flush(): boolean
    {
        this._entry = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._entry = readBobbaBotLogEntry(wrapper);

        return true;
    }

    public get entry(): IBobbaBotLogEntry
    {
        return this._entry;
    }
}
