import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IWobblePlayerState
{
    /** -1..1 : sortie de la jauge = chute */
    balance: number;
    velocity: number;
    /** 0 = rien, 1 = arme le coup, 2 = frappe, 3 = esquive */
    action: number;
    actionMs: number;
    /** -1 tant que le joueur est debout, sinon temps ecoule depuis le debut de la chute */
    fallMs: number;
    fallDir: number;
}

/** Etat du duel envoye plusieurs fois par seconde : temps restant et etat des deux joueurs. */
export class WobbleStateParser implements IMessageParser
{
    private _timeLeftMs: number;
    private _players: IWobblePlayerState[];

    public flush(): boolean
    {
        this._timeLeftMs = 0;
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._timeLeftMs = wrapper.readInt();

        for(let i = 0; i < 2; i++)
        {
            this._players.push({
                balance: wrapper.readInt() / 1000,
                velocity: wrapper.readInt() / 1000,
                action: wrapper.readInt(),
                actionMs: wrapper.readInt(),
                fallMs: wrapper.readInt(),
                fallDir: wrapper.readInt()
            });
        }

        return true;
    }

    public get timeLeftMs(): number { return this._timeLeftMs; }
    public get players(): IWobblePlayerState[] { return this._players; }
}
