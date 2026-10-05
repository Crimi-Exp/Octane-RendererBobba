import { IMessageComposer } from '@octane/api';

/** Ouvre l'outil BobbaBot (staff) : le serveur repond avec BOBBABOT_TOOL_DATA. */
export class BobbaBotToolRequestComposer implements IMessageComposer<[]>
{
    public getMessageArray(): []
    {
        return [];
    }

    public dispose(): void
    {
        return;
    }
}
