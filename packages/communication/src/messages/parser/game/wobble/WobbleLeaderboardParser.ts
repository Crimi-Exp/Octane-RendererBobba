import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface IWobbleLeaderboardEntry
{
    userId: number;
    name: string;
    figure: string;
    gender: string;
    wins: number;
}

/** Classement du Wobble Squabble (parties gagnees), envoye au debut de chaque duel. */
export class WobbleLeaderboardParser implements IMessageParser
{
    private _entries: IWobbleLeaderboardEntry[];

    public flush(): boolean
    {
        this._entries = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let count = wrapper.readInt();

        while(count > 0)
        {
            this._entries.push({
                userId: wrapper.readInt(),
                name: wrapper.readString(),
                figure: wrapper.readString(),
                gender: wrapper.readString(),
                wins: wrapper.readInt()
            });
            count--;
        }

        return true;
    }

    public get entries(): IWobbleLeaderboardEntry[] { return this._entries; }
}
