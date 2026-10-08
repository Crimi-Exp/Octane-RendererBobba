import { IMessageComposer } from '@octane/api';

/** BobbaTok (9817) : ferme le hub (n'est plus spectateur). */
export class YoutubeHubCloseComposer implements IMessageComposer<[]>
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
