import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Brainrot : un effet au-dessus d'un avatar (1 tape, 2 gele, 3 vole un mobi, 4 mobi recupere) et sa duree. */
export class BrainrotFxParser implements IMessageParser
{
    private _unitId: number;
    private _type: number;
    private _durationMs: number;

    public flush(): boolean
    {
        this._unitId = 0;
        this._type = 0;
        this._durationMs = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._unitId = wrapper.readInt();
        this._type = wrapper.readInt();
        this._durationMs = wrapper.readInt();

        return true;
    }

    public get unitId(): number
    {
        return this._unitId;
    }
    public get type(): number
    {
        return this._type;
    }
    public get durationMs(): number
    {
        return this._durationMs;
    }
}
