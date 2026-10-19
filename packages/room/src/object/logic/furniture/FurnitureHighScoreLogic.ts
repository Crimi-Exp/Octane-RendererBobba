import { RoomObjectVariable } from '@octane/api';
import { RoomObjectWidgetRequestEvent } from '@octane/events';
import { ObjectDataUpdateMessage, RoomObjectUpdateMessage } from '../../../messages';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureHighScoreLogic extends FurnitureLogic
{
    private static SHOW_WIDGET_IN_STATE = 1;

    private _state = -1;

    public getEventTypes(): string[]
    {
        return [RoomObjectWidgetRequestEvent.HIGH_SCORE_DISPLAY, RoomObjectWidgetRequestEvent.HIDE_HIGH_SCORE_DISPLAY];
    }

    public tearDown(): void
    {
        if(this.object.model.getValue(RoomObjectVariable.FURNITURE_REAL_ROOM_OBJECT) === 1)
        {
            this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.HIDE_HIGH_SCORE_DISPLAY, this.object));
        }

        super.tearDown();
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        super.processUpdateMessage(message);

        if(this.object.model.getValue(RoomObjectVariable.FURNITURE_REAL_ROOM_OBJECT) !== 1) return;

        if(message instanceof ObjectDataUpdateMessage)
        {
            // BobbaTok : etat 2 = classement affiche et mobi cache, etat 3 = classement eteint et mobi cache
            const state = message.state;

            this.object.model.setValue(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER, ((state === 2) || (state === 3)) ? 0 : 1);

            if((state === FurnitureHighScoreLogic.SHOW_WIDGET_IN_STATE) || (state === 2))
            {
                this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.HIGH_SCORE_DISPLAY, this.object));
            }
            else
            {
                this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.HIDE_HIGH_SCORE_DISPLAY, this.object));
            }

            this._state = message.state;
        }
    }
}
