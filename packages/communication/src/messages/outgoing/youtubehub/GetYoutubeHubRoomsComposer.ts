import { IMessageComposer } from '@octane/api';

/** BobbaTok (9823) : apparts ou le hub joue. Reponse : YOUTUBE_HUB_ROOMS. */
export class GetYoutubeHubRoomsComposer implements IMessageComposer<[]>
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
