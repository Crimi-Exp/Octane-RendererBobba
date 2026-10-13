import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IWobblePlayerState
{
    /** -1..1 : sortie de la jauge = chute */
    balance: number;
    velocity: number;
    /** 0 = rien, 5/6 = pousse a gauche/droite, 7 = pas sur le poteau, 8 = stabilisation */
    action: number;
    actionMs: number;
    /** -1 tant que le joueur est debout, sinon temps ecoule depuis le debut de la chute */
    fallMs: number;
    fallDir: number;
    /** position sur le poteau : de -3 (bout du camp 0) a 4 (bout du camp 1) */
    position: number;
    /** stabilisation deja utilisee pendant la manche */
    stabiliseUsed: boolean;
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
                fallDir: wrapper.readInt(),
                position: wrapper.readInt(),
                stabiliseUsed: (wrapper.readInt() === 1)
            });
        }

        return true;
    }

    public get timeLeftMs(): number { return this._timeLeftMs; }
    public get players(): IWobblePlayerState[] { return this._players; }
}
