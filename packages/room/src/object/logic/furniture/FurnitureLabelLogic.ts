import { RoomObjectWidgetRequestEvent } from '@octane/events';
import { FurnitureLogic } from './FurnitureLogic';

// wf_label : mobi au sol dont le texte (donnees du mobi) est dessine dans une bulle triee avec la piece
// (FurnitureLabelVisualization). Le double-clic sur le mobi ou sa bulle demande au client d'ouvrir
// l'edition ; la logique sert aussi a autoriser l'enregistrement de son texte alors que c'est un objet au sol.
export class FurnitureLabelLogic extends FurnitureLogic
{
    public getEventTypes(): string[]
    {
        return this.mergeTypes(super.getEventTypes(), [ RoomObjectWidgetRequestEvent.WF_LABEL ]);
    }

    public useObject(): void
    {
        if(!this.object || !this.eventDispatcher) return;

        this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.WF_LABEL, this.object));
    }
}
