import { IRoomGeometry, MouseEventType } from '@octane/api';
import { RoomObjectWidgetRequestEvent, RoomSpriteMouseEvent } from '@octane/events';
import { RoomObjectLogicBase } from './RoomObjectLogicBase';

/** BobbaTok : un clic sur un tag mural demande au client le menu du tag (auteur, suppression). */
export class WallTagLogic extends RoomObjectLogicBase
{
    public getEventTypes(): string[]
    {
        return this.mergeTypes(super.getEventTypes(), [ RoomObjectWidgetRequestEvent.WALL_TAG ]);
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        if(!event || !this.object || !this.eventDispatcher) return;

        if(event.type === MouseEventType.MOUSE_CLICK)
        {
            this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.WALL_TAG, this.object));
        }
    }
}
