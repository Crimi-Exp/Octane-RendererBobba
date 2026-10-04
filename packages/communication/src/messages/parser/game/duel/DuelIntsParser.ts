import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Duel des Sorciers : paquet d'entiers (file, etat, fin). Le serveur envoie leur nombre puis les valeurs ; le
 * client les lit dans l'ordre decrit par DuelStateComposer, DuelQueueComposer et DuelEndComposer.
 */
export class DuelIntsParser implements IMessageParser
{
    private _values: number[] = [];

    public flush(): boolean
    {
        this._values = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            if(!wrapper.bytesAvailable) break;
            this._values.push(wrapper.readInt());
        }

        return true;
    }

    public get values(): number[]
    {
        return this._values;
    }
}
