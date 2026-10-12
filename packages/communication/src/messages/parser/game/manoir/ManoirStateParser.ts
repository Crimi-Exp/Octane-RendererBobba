import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Un habbo de l'appart Manoir (inRun = false s'il ne joue pas). */
export interface IManoirPlayer
{
    unitId: number;
    inRun: boolean;
    torchOn: boolean;
    /** 0..100 */
    battery: number;
    elapsedMs: number;
    deaths: number;
}

/** Un fantome : son avatar (bot temporaire), sa case et s'il chasse une lumiere. */
export interface IManoirGhost
{
    unitId: number;
    x: number;
    y: number;
    chasing: boolean;
}

/** Le Manoir : l'etat de l'appart (toutes les 200 ms ; active = false quand l'appart cesse d'etre un Manoir). */
export class ManoirStateParser implements IMessageParser
{
    private _active: boolean;
    private _players: IManoirPlayer[];
    private _ghosts: IManoirGhost[];

    public flush(): boolean
    {
        this._active = false;
        this._players = [];
        this._ghosts = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._active = wrapper.readBoolean();

        if(!this._active) return true;

        const playerCount = wrapper.readInt();
        for(let i = 0; i < playerCount; i++)
        {
            const unitId = wrapper.readInt();
            const inRun = wrapper.readBoolean();
            const torchOn = wrapper.readBoolean();
            const battery = Math.max(0, Math.min(100, wrapper.readInt()));
            const elapsedMs = wrapper.readInt();
            const deaths = wrapper.readInt();
            this._players.push({ unitId, inRun, torchOn, battery, elapsedMs, deaths });
        }

        const ghostCount = wrapper.readInt();
        for(let i = 0; i < ghostCount; i++)
        {
            const unitId = wrapper.readInt();
            const x = wrapper.readInt();
            const y = wrapper.readInt();
            const chasing = wrapper.readBoolean();
            this._ghosts.push({ unitId, x, y, chasing });
        }

        return true;
    }

    public get active(): boolean
    {
        return this._active;
    }
    public get players(): IManoirPlayer[]
    {
        return this._players;
    }
    public get ghosts(): IManoirGhost[]
    {
        return this._ghosts;
    }
}
