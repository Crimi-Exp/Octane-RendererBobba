import { describe, expect, it } from 'vitest';
import { AvatarRenderManager } from '../AvatarRenderManager';
import { HabboAvatarActions } from './HabboAvatarActions';

describe('coucou (Wave) comme Habbo AIR', () => {
    it('targets the left hand animated by HabboAvatarAnimation', () => {
        const data = { actions: [{ id: 'Wave', activePartSet: 'handRight' }, { id: 'Blow', activePartSet: 'handRight' }] };

        AvatarRenderManager.fixOfficialActions(data);

        expect(data.actions[0].activePartSet).toBe('handLeft');
        expect(data.actions[1].activePartSet).toBe('handRight');
        expect(HabboAvatarActions.actions.find(action => action.id === 'Wave')?.activePartSet).toBe('handLeft');
    });
});
