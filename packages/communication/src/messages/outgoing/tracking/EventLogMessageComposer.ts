import { IMessageComposer } from '@octane/api';

/**
 * Official `HabboTracking.trackEventLog(category, type, action)` (header 3457, EVENT_TRACKER) : the
 * server reads the three strings (e.g. `Quiz` / `7` / `talent.quiz.change_page` when the Safety
 * booklet reaches its last page, which completes ACH_SafetyQuizGraduate1).
 */
export class EventLogMessageComposer implements IMessageComposer<ConstructorParameters<typeof EventLogMessageComposer>>
{
    private _data: ConstructorParameters<typeof EventLogMessageComposer>;

    constructor(category: string, type: string, action: string)
    {
        this._data = [ category, type, action ];
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
