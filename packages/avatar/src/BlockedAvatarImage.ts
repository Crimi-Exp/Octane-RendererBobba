import { AvatarAction } from '@octane/api';
import { AssetAliasCollection } from './alias';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarImage } from './AvatarImage';
import { AvatarStructure } from './AvatarStructure';
import { EffectAssetDownloadManager } from './EffectAssetDownloadManager';

/**
 * Official `com.sulake.habbo.avatar.BlockedAvatarImage`: a blocked player is drawn with the
 * anonymous placeholder figure (`hd-99999-99999`), whatever their real look is. It still sits,
 * lies, walks, dances, waves, holds signs and items and wears effects, so the ghost keeps moving
 * like the player behind it; talk, gestures, expressions and blinking are dropped.
 */
export class BlockedAvatarImage extends AvatarImage
{
    constructor(structure: AvatarStructure, assets: AssetAliasCollection, figure: AvatarFigureContainer, scale: string, effectManager: EffectAssetDownloadManager)
    {
        super(structure, assets, figure, scale, effectManager, null);
    }

    public appendAction(actionType: string, ...actionParameters: any[]): boolean
    {
        switch(actionType)
        {
            case AvatarAction.POSTURE:
                switch((actionParameters && actionParameters.length) ? String(actionParameters[0]) : '')
                {
                    case AvatarAction.POSTURE_LAY:
                    case AvatarAction.POSTURE_WALK:
                    case AvatarAction.POSTURE_STAND:
                    case AvatarAction.POSTURE_SWIM:
                    case AvatarAction.POSTURE_FLOAT:
                    case AvatarAction.POSTURE_SIT:
                        super.appendAction(actionType, ...actionParameters);
                        break;
                }
                break;
            case AvatarAction.EFFECT:
            case AvatarAction.DANCE:
            case AvatarAction.EXPRESSION_WAVE:
            case AvatarAction.SIGN:
            case AvatarAction.CARRY_OBJECT:
            case AvatarAction.USE_OBJECT:
            case AvatarAction.EXPRESSION_BLOW_A_KISS:
            case AvatarAction.EXPRESSION_67:
            case AvatarAction.EXPRESSION_MAGIE:
            case AvatarAction.EXPRESSION_FIGHT:
                super.appendAction(actionType, ...actionParameters);
                break;
        }

        return true;
    }

    public isBlocked(): boolean
    {
        return true;
    }
}
