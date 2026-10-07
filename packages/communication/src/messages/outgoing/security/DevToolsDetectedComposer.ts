import { IMessageComposer } from '@octane/api';

/** BobbaTok anti DevTools: developer tools detected (custom header 9780). signal: 1 debugger trap, 2 console timing. */
export class DevToolsDetectedComposer implements IMessageComposer<ConstructorParameters<typeof DevToolsDetectedComposer>>
{
    private _data: ConstructorParameters<typeof DevToolsDetectedComposer>;

    constructor(signal: number)
    {
        this._data = [ signal ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
