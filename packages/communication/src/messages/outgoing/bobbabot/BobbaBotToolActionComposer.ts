import { IMessageComposer } from '@octane/api';

/**
 * Action de l'outil BobbaBot : string action, string value, string extra, int number, bool flag.
 * Actions : word.save, word.remove, retro.add, retro.remove, allow.add, allow.remove, pardon, test, setting, log.
 */
export class BobbaBotToolActionComposer implements IMessageComposer<[ string, string, string, number, boolean ]>
{
    private _data: [ string, string, string, number, boolean ];

    constructor(action: string, value: string = '', extra: string = '', number: number = 0, flag: boolean = false)
    {
        this._data = [ action, value ?? '', extra ?? '', Math.trunc(Number(number) || 0), !!flag ];
    }

    public getMessageArray(): [ string, string, string, number, boolean ]
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
