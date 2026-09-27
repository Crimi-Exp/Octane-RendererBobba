import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { WallTagData } from './WallTagData';

export class WallTagsMessageParser implements IMessageParser
{
    private _tags: WallTagData[];

    public flush(): boolean
    {
        this._tags = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let count = wrapper.readInt();

        while(count > 0)
        {
            this._tags.push(new WallTagData(wrapper));

            count--;
        }

        return true;
    }

    public get tags(): WallTagData[]
    {
        return this._tags;
    }
}
