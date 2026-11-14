import { IRoomObjectModel, RoomObjectVariable } from '@octane/api';
import { RoomObjectRoomAdEvent } from '@octane/events';
import { HabboWebTools } from '@octane/utils';
import { FurnitureRoomBrandingLogic } from './FurnitureRoomBrandingLogic';

export class FurnitureRoomBackgroundLogic extends FurnitureRoomBrandingLogic
{
    // BobbaTok patch 273 : un fond (Background) devient cliquable quand on lui donne un clickUrl dans sa fiche.
    // Sans clickUrl, rien ne change. Meme comportement que les panneaux (billboard), mais sans leur cadre.
    constructor()
    {
        super();

        this._hasClickUrl = true;
    }

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        const url = model.getValue<string>(RoomObjectVariable.FURNITURE_BRANDING_URL);

        return (url && url.length) ? url : null;
    }

    protected handleAdClick(objectId: number, objectType: string, clickUrl: string): void
    {
        if(clickUrl.indexOf('http') === 0)
        {
            HabboWebTools.openUntrustedWebPage(clickUrl);

            return;
        }

        if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectRoomAdEvent(RoomObjectRoomAdEvent.ROOM_AD_FURNI_CLICK, this.object, '', clickUrl));
    }
}
