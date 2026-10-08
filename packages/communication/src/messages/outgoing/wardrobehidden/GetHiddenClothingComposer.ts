import { IMessageComposer } from '@octane/api';

/** BobbaTok (9813) : demande la liste des vetements masques du joueur. Reponse : HIDDEN_CLOTHING. */
export class GetHiddenClothingComposer implements IMessageComposer<[]>
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
