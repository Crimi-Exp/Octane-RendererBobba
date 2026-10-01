import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** UNO : ouvrir le menu (commande :uno). */
export class UnoOpenParser implements IMessageParser
{
    public flush(): boolean
    {
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        return !!wrapper;
    }
}
