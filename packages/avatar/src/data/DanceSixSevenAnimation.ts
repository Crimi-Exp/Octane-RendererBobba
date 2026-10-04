import { IAssetAnimation } from '@octane/api';

// Animation officielle « 67 » de Habbo AIR (HabboAvatarRenderLib : dance_sixseven_xml, « 67 meme gesture »).
// Enregistree d'office comme dans le client Flash (BUILT_IN_ANIMATION_ASSET_NAMES) ; jouee par l'action
// dance + parametre sixseven quand un avatar recoit l'expression 67 (990 ms).
export const DanceSixSevenAnimation: IAssetAnimation = {
    name: 'dance.sixseven',
    desc: '67 meme gesture',
    frames: [
        { bodyparts: [ { id: 'leftarm', action: 'Default', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'Default', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: -1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: -1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 1, dx: 0, dy: 0, dd: 1 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 0, dx: 0, dy: 0, dd: 1 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 1, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: -1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: -1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 1, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: -1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'Default', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'Default', frame: 1, dx: 1, dy: 1, dd: 0 } ] },
        { bodyparts: [ { id: 'leftarm', action: 'Default', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'Default', frame: 0, dx: 1, dy: 0, dd: 0 } ] }
    ]
};
