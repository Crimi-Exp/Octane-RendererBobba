import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export interface RewardTrackLevelData { level: number; target: number; progress: number; points: number; }
export interface RewardTrackTaskData { id: number; key: string; levels: RewardTrackLevelData[]; }
export interface RewardTrackRewardData { points: number; habbiconId: number; hc: boolean; claimed: boolean; }

/** BobbaTok Reward Track state (custom header 9490), see BattlePassStateComposer. */
export class RewardTrackParser implements IMessageParser
{
    private _points: number;
    private _maxPoints: number;
    private _hasHc: boolean;
    private _rewards: RewardTrackRewardData[];
    private _tasks: RewardTrackTaskData[];

    public flush(): boolean
    {
        this._points = 0;
        this._maxPoints = 0;
        this._hasHc = false;
        this._rewards = [];
        this._tasks = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._points = wrapper.readInt();
        this._maxPoints = wrapper.readInt();
        this._hasHc = wrapper.readBoolean();

        let count = wrapper.readInt();
        while(count-- > 0)
        {
            this._rewards.push({ points: wrapper.readInt(), habbiconId: wrapper.readInt(), hc: wrapper.readBoolean(), claimed: wrapper.readBoolean() });
        }

        count = wrapper.readInt();
        while(count-- > 0)
        {
            const id = wrapper.readInt();
            const key = wrapper.readString();
            let levelCount = wrapper.readInt();
            const levels: RewardTrackLevelData[] = [];
            while(levelCount-- > 0)
            {
                levels.push({ level: wrapper.readInt(), target: wrapper.readInt(), progress: wrapper.readInt(), points: wrapper.readInt() });
            }
            this._tasks.push({ id, key, levels });
        }

        return true;
    }

    public get points(): number { return this._points; }
    public get maxPoints(): number { return this._maxPoints; }
    public get hasHc(): boolean { return this._hasHc; }
    public get rewards(): RewardTrackRewardData[] { return this._rewards; }
    public get tasks(): RewardTrackTaskData[] { return this._tasks; }
}
