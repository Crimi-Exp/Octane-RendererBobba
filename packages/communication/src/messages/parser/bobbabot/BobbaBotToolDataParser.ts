import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { IBobbaBotLogEntry, readBobbaBotLogEntry } from './BobbaBotAlertParser';

export interface IBobbaBotWord
{
    word: string;
    severity: number;
    wholeWord: boolean;
}

/** Contenu de l'outil BobbaBot : listes, journal et reglages. */
export class BobbaBotToolDataParser implements IMessageParser
{
    private _open: boolean = false;
    private _status: string = '';
    private _enabled: boolean = true;
    private _words: IBobbaBotWord[] = [];
    private _retros: string[] = [];
    private _whitelist: string[] = [];
    private _logFilter: string = '';
    private _filterPoints: number = -1;
    private _log: IBobbaBotLogEntry[] = [];
    private _settings: Map<string, string> = new Map();

    public flush(): boolean
    {
        this._open = false;
        this._status = '';
        this._enabled = true;
        this._words = [];
        this._retros = [];
        this._whitelist = [];
        this._logFilter = '';
        this._filterPoints = -1;
        this._log = [];
        this._settings = new Map();

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._open = wrapper.readBoolean();
        this._status = wrapper.readString();
        this._enabled = wrapper.readBoolean();

        let count = wrapper.readInt();
        if(count < 0 || count > 20000) return false;
        for(let i = 0; i < count; i++) this._words.push({ word: wrapper.readString(), severity: wrapper.readInt(), wholeWord: wrapper.readBoolean() });

        count = wrapper.readInt();
        if(count < 0 || count > 20000) return false;
        for(let i = 0; i < count; i++) this._retros.push(wrapper.readString());

        count = wrapper.readInt();
        if(count < 0 || count > 20000) return false;
        for(let i = 0; i < count; i++) this._whitelist.push(wrapper.readString());

        this._logFilter = wrapper.readString();
        this._filterPoints = wrapper.readInt();

        count = wrapper.readInt();
        if(count < 0 || count > 1000) return false;
        for(let i = 0; i < count; i++) this._log.push(readBobbaBotLogEntry(wrapper));

        count = wrapper.readInt();
        if(count < 0 || count > 100) return false;
        for(let i = 0; i < count; i++) this._settings.set(wrapper.readString(), wrapper.readString());

        return true;
    }

    public get open(): boolean { return this._open; }
    public get status(): string { return this._status; }
    public get enabled(): boolean { return this._enabled; }
    public get words(): IBobbaBotWord[] { return this._words; }
    public get retros(): string[] { return this._retros; }
    public get whitelist(): string[] { return this._whitelist; }
    public get logFilter(): string { return this._logFilter; }
    public get filterPoints(): number { return this._filterPoints; }
    public get log(): IBobbaBotLogEntry[] { return this._log; }
    public get settings(): Map<string, string> { return this._settings; }
}
