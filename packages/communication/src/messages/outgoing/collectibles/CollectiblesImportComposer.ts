import { IMessageComposer } from '@octane/api';

/**
 * Import de NFT (staff) : une action ("status", "begin", "chunk", "analyse", "apply", "cancel") et ses donnees,
 * coupees en morceaux de 60 000 caracteres au plus (une chaine du protocole fait au plus 64 Ko).
 */
export class CollectiblesImportComposer implements IMessageComposer<(string | number)[]>
{
    public static readonly PART_SIZE = 60000;

    private _data: (string | number)[];

    constructor(action: string, data: string = '')
    {
        const parts: string[] = [];

        for(let i = 0; i < data.length; i += CollectiblesImportComposer.PART_SIZE) parts.push(data.substring(i, i + CollectiblesImportComposer.PART_SIZE));

        this._data = [action, parts.length, ...parts];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
