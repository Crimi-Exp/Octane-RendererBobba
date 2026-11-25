import { ILocalizationManager } from '@octane/api';
import { BadgePointLimitsEvent, GetCommunication } from '@octane/communication';
import { GetConfiguration } from '@octane/configuration';
import { loadGamedata } from '@octane/utils';
import { BadgeBaseAndLevel } from './BadgeBaseAndLevel';

export class LocalizationManager implements ILocalizationManager
{
    // Texts set at run time (setValue); they win over the text files.
    private _definitions: Map<string, string> = new Map();
    // The parsed text files, in load order; a key is read from them (and kept in the cache) on its first lookup.
    // (duckietm 4017a15 : on ne recopie plus des dizaines de milliers de cles au demarrage)
    private _baseDocuments: { [index: string]: unknown }[] = [];
    private _baseCache: Map<string, string> = new Map();
    private _furnitureResolver: ((key: string) => string | null) | null = null;
    private _overrideDefinitions: Map<string, string> = new Map();
    private _parameters: Map<string, Map<string, string>> = new Map();
    private _badgePointLimits: Map<string, number> = new Map();
    private _romanNumerals: string[] = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX' ];

    public async init(): Promise<void>
    {
        try
        {
            const urls = GetConfiguration().getValue<string[]>('external.texts.url').slice();

            if(!urls || !urls.length) throw new Error('Missing "external.texts.url" in config — add the localization URL to your ui-config.json');

            const firstEmptyUrl = urls.findIndex(url => !url || !url.length);
            const textUrls = ((firstEmptyUrl >= 0) ? urls.slice(0, firstEmptyUrl) : urls).map(url => GetConfiguration().interpolate(url));

            // Downloaded together, applied in order so later files still override earlier ones.
            const documents = await Promise.all(textUrls.map(async url =>
            {
                try
                {
                    return await loadGamedata(url);
                }
                catch (err)
                {
                    throw new Error(`Could not load localization file "${ url }" — check "external.texts.url" in ui-config.json (${ err?.message || err })`);
                }
            }));

            // A new load replaces the text files of an earlier one.
            this._baseDocuments = [];
            this._baseCache.clear();

            for(const data of documents) this.parseLocalization(data);

            GetCommunication().registerMessageEvent(new BadgePointLimitsEvent(this.onBadgePointLimitsEvent.bind(this)));
        }

        catch (err)
        {
            throw new Error(err.message || String(err));
        }
    }

    private parseLocalization(data: { [index: string]: any }): boolean
    {
        if(!data) return false;

        // Kept as parsed: copying tens of thousands of keys into a map is boot time spent on texts never shown.
        this._baseDocuments.push(data);
        this._baseCache.clear();

        return true;
    }

    /** A key of the text files; a later file wins over an earlier one. */
    private lookupBaseDefinition(key: string): string | undefined
    {
        if(this._baseCache.has(key)) return this._baseCache.get(key);

        for(let i = this._baseDocuments.length - 1; i >= 0; i--)
        {
            const document = this._baseDocuments[i];

            if(!Object.prototype.hasOwnProperty.call(document, key)) continue;

            const value = document[key] as string;

            this._baseCache.set(key, value);

            return value;
        }

        return undefined;
    }

    public setFurnitureResolver(resolver: ((key: string) => string | null) | null): void
    {
        this._furnitureResolver = resolver;
    }

    /** A furniture name or description (roomItem.* / wallItem.*) from the furniture data, when a resolver is set. */
    private resolveFurnitureValue(key: string): string | null
    {
        if(!this._furnitureResolver) return null;

        if(!key.startsWith('roomItem.') && !key.startsWith('wallItem.')) return null;

        const value = this._furnitureResolver(key);

        return ((value === null) || (value === undefined)) ? null : value;
    }

    private onBadgePointLimitsEvent(event: BadgePointLimitsEvent): void
    {
        const parser = event.getParser();

        for(const data of parser.data) this.setBadgePointLimit(data.badgeId, data.limit);
    }

    public getBadgePointLimit(badge: string): number
    {
        return (this._badgePointLimits.get(badge) || -1);
    }

    public setBadgePointLimit(badge: string, point: number): void
    {
        this._badgePointLimits.set(badge, point);
    }

    public getRomanNumeral(number: number): string
    {
        return this._romanNumerals[Math.max(0, (number - 1))];
    }

    public getPreviousLevelBadgeId(badgeName: string): string
    {
        const badge = new BadgeBaseAndLevel(badgeName);

        badge.level--;

        return badge.getBadgeId;
    }

    public hasValue(key: string): boolean
    {
        return (this._overrideDefinitions.has(key) || (this.resolveFurnitureValue(key) !== null) || this._definitions.has(key) || (this.lookupBaseDefinition(key) !== undefined));
    }

    public getValue(key: string, doParams: boolean = true): string
    {
        if(!key || !key.length) return null;

        const keys = key.match(/\$\{.[^}]*\}/g);

        if(keys && keys.length)
        {
            for(const splitKey of keys) key = key.replace(splitKey, this.getValue(splitKey.slice(2, -1), doParams));
        }

        // A furniture text comes from the furniture data while it knows the item, so it never goes stale;
        // what setValue stored for one is only kept for items it does not know.
        let value = (this._overrideDefinitions.get(key) || this.resolveFurnitureValue(key) || this._definitions.get(key) || this.lookupBaseDefinition(key) || null);

        if(!value)
        {
            value = (GetConfiguration().definitions.get(key) as any);

            if(value) return value;
        }

        if(value && doParams)
        {
            const parameters = this._parameters.get(key);

            if(parameters)
            {
                for(const [parameter, replacement] of parameters)
                {
                    value = value.replace('%' + parameter + '%', replacement);
                }
            }
        }

        return (value || key);
    }

    public getValueWithParameter(key: string, parameter: string, replacement: string): string
    {
        const value = this.getValue(key, false);

        const replacedValue = value.replace('%' + parameter + '%', replacement);

        if(value.startsWith('%{'))
        {
            // This adds support for multi-optioned texts like
            // catalog.vip.item.header.months=%{NUM_MONTHS|0 months|1 month|%% months}
            // It only checks for this multi-optioned thext if the value of the key starts with %{

            // If it does, it will create a RegEx with the provided parameter, eg. NUM_DAYS or NUM_MONTS
            // Then, based on the provided replacement it searches for the resultgroup based on the replacement.
            // If the replacement is not either 0, 1 - it will be assumed it will be plural. (eg. Months)
            const regex = new RegExp('%{' + parameter.toUpperCase() + '\\|([^|]*)\\|([^|]*)\\|([^|]*)}');
            const result = value.match(regex);

            if(!result) return replacedValue;

            let indexKey = -1;
            const replacementAsNumber = Number.parseInt(replacement);
            let replace = false;

            switch(replacementAsNumber)
            {
                case 0:
                    indexKey = 1;
                    break;
                case 1:
                    indexKey = 2;
                    break;
                default:
                case 2:
                    indexKey = 3;
                    replace = true;
                    break;
            }


            if(indexKey == -1 || typeof result[indexKey] == 'undefined')
            {
                return replacedValue;
            }

            const valueFromResults = result[indexKey];

            if(valueFromResults)
            {
                return valueFromResults.replace('%%', replacement);
            }
        }

        return replacedValue;
    }

    public getValueWithParameters(key: string, parameters: string[], replacements: string[]): string
    {
        let value = this.getValue(key, false);

        if(parameters)
        {
            for(let i = 0; i < parameters.length; i++)
            {
                const parameter = parameters[i];
                const replacement = replacements[i];

                if(replacement === undefined) continue;

                value = value.replace('%' + parameter + '%', replacement);

                if(value.startsWith('%{'))
                {
                    const regex = new RegExp('%{' + parameter.toUpperCase() + '\\|([^|]*)\\|([^|]*)\\|([^|]*)}');
                    const result = value.match(regex);

                    if(!result) continue;

                    const replacementAsNumber = parseInt(replacement);

                    let indexKey = -1;
                    let replace = false;

                    switch(replacementAsNumber)
                    {
                        case 0:
                            indexKey = 1;
                            break;
                        case 1:
                            indexKey = 2;
                            break;
                        case 2:
                        default:
                            indexKey = 3;
                            replace = true;
                            break;
                    }


                    if((indexKey === -1) || (typeof result[indexKey] === 'undefined')) continue;

                    const valueFromResults = result[indexKey];

                    if(valueFromResults)
                    {
                        value = valueFromResults.replace('%%', replacement);
                    }
                }
            }
        }

        return value;
    }

    public setValue(key: string, value: string): void
    {
        this._definitions.set(key, value);
    }

    public setOverrideValues(values: Map<string, string>): void
    {
        this._overrideDefinitions = (values || new Map());
    }

    public clearOverrideValues(): void
    {
        this._overrideDefinitions.clear();
    }

    public registerParameter(key: string, parameter: string, value: string): void
    {
        if(!key || (key.length === 0) || !parameter || (parameter.length === 0)) return;

        let existing = this._parameters.get(key);

        if(!existing)
        {
            existing = new Map();

            this._parameters.set(key, existing);
        }

        existing.set(parameter, value);
    }

    public getBadgeName(key: string): string
    {
        const badge = new BadgeBaseAndLevel(key);
        const keys = ['badge_name_' + key, 'badge_name_' + badge.base];

        let name = this.fixBadLocalization(this.getExistingKey(keys));

        name = name.replace('%roman%', this.getRomanNumeral(badge.level));

        return name;
    }

    public getBadgeDesc(key: string): string
    {
        const badge = new BadgeBaseAndLevel(key);
        const keys = ['badge_desc_' + key, 'badge_desc_' + badge.base];

        let desc = this.fixBadLocalization(this.getExistingKey(keys));

        const limit = this.getBadgePointLimit(key);

        if(limit > -1) desc = desc.replace('%limit%', limit.toString());

        desc = desc.replace('%roman%', this.getRomanNumeral(badge.level));

        return desc;
    }

    private getExistingKey(keys: string[]): string
    {
        for(const entry of keys)
        {
            const item = this.getValue(entry);
            if(item != entry) return item;
        }

        return '';
    }

    private fixBadLocalization(value: string): string
    {
        return value.replace('${', '$')
            .replace('{', '$')
            .replace('}', '$');
    }
}
