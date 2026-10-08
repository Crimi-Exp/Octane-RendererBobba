import { IMessageComposer } from '@octane/api';

/** BobbaTok (9816) : ouvre le hub de l'appart (devient spectateur). Reponse : YOUTUBE_HUB_STATE. */
export class YoutubeHubOpenComposer implements IMessageComposer<[]>
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
