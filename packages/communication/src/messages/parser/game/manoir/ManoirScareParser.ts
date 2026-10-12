import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Le Manoir : une frayeur pour moi (type 1 = attrape par un fantome) et le fantome en cause. */
export class ManoirScareParser implements IMessageParser
{
    private _type: number;
    private _ghostUnitId: number;

    public flush(): boolean
    {
        this._type = 0;
        this._ghostUnitId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._type = wrapper.readInt();
        this._ghostUnitId = wrapper.readInt();

        return true;
    }

    public get type(): number
    {
        return this._type;
    }
    public get ghostUnitId(): number
    {
        return this._ghostUnitId;
    }
}
