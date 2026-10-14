import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** BobbaTok : un joueur de l'appart joue (ou ne joue plus) a un jeu ; game = nom affiche, '' = plus rien. */
export class RoomUnitGamePresenceParser implements IMessageParser
{
    private _unitId: number;
    private _game: string;

    public flush(): boolean
    {
        this._unitId = -1;
        this._game = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._unitId = wrapper.readInt();
        this._game = wrapper.readString();

        return true;
    }

    public get unitId(): number
    {
        return this._unitId;
    }

    public get game(): string
    {
        return this._game;
    }
}
