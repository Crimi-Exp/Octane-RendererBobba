import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IUnoSeatState
{
    cards: number;
    uno: boolean;
    left: boolean;
}

/**
 * Etat UNO : phase (0 distribution, 1 jeu, 2 fin), tour, sens, couleur, carte du dessus, paquet, defausse,
 * ms restantes du tour, joueur denoncable (-1), ta carte piochee jouable (-1), les joueurs, ta main, les evenements
 * ([type, a, b, c]).
 */
export class UnoStateParser implements IMessageParser
{
    private _phase: number;
    private _turn: number;
    private _direction: number;
    private _color: number;
    private _top: number;
    private _deckCount: number;
    private _discardCount: number;
    private _turnLeftMs: number;
    private _vulnerable: number;
    private _drawnCard: number;
    private _seats: IUnoSeatState[];
    private _hand: number[];
    private _events: number[][];

    public flush(): boolean
    {
        this._phase = 0;
        this._turn = 0;
        this._direction = 1;
        this._color = 0;
        this._top = 0;
        this._deckCount = 0;
        this._discardCount = 0;
        this._turnLeftMs = 0;
        this._vulnerable = -1;
        this._drawnCard = -1;
        this._seats = [];
        this._hand = [];
        this._events = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._phase = wrapper.readInt();
        this._turn = wrapper.readInt();
        this._direction = wrapper.readInt();
        this._color = wrapper.readInt();
        this._top = wrapper.readInt();
        this._deckCount = wrapper.readInt();
        this._discardCount = wrapper.readInt();
        this._turnLeftMs = wrapper.readInt();
        this._vulnerable = wrapper.readInt();
        this._drawnCard = wrapper.readInt();

        const seats = wrapper.readInt();
        for(let i = 0; i < seats; i++)
        {
            const cards = wrapper.readInt();
            const uno = wrapper.readInt() === 1;
            const left = wrapper.readInt() === 1;
            this._seats.push({ cards, uno, left });
        }

        const hand = wrapper.readInt();
        for(let i = 0; i < hand; i++) this._hand.push(wrapper.readInt());

        const events = wrapper.readInt();
        for(let i = 0; i < events; i++) this._events.push([ wrapper.readInt(), wrapper.readInt(), wrapper.readInt(), wrapper.readInt() ]);

        return true;
    }

    public get phase(): number
    {
        return this._phase;
    }
    public get turn(): number
    {
        return this._turn;
    }
    public get direction(): number
    {
        return this._direction;
    }
    public get color(): number
    {
        return this._color;
    }
    public get top(): number
    {
        return this._top;
    }
    public get deckCount(): number
    {
        return this._deckCount;
    }
    public get discardCount(): number
    {
        return this._discardCount;
    }
    public get turnLeftMs(): number
    {
        return this._turnLeftMs;
    }
    public get vulnerable(): number
    {
        return this._vulnerable;
    }
    public get drawnCard(): number
    {
        return this._drawnCard;
    }
    public get seats(): IUnoSeatState[]
    {
        return this._seats;
    }
    public get hand(): number[]
    {
        return this._hand;
    }
    public get events(): number[][]
    {
        return this._events;
    }
}
