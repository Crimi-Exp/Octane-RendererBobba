// Pack d'animations « combat » BobbaTok (effets fx.6000 a fx.6153) : les effets jouent des actions
// (Punch, FightCmb...) dont les dessins sont dans hh_human_body (h_pch_*, h_cmb_*...). Ces actions
// n'existent pas dans HabboAvatarActions.json officiel : on les declare ici.
export const BOBBATOK_FIGHT_ACTIONS: { id: string; code: string }[] = [
    { id: 'Jump', code: 'jmp' }, { id: 'Run', code: 'run' },
    { id: 'Punch', code: 'pch' }, { id: 'Punch2', code: 'pc2' }, { id: 'Punch2Guard', code: 'pc2' },
    { id: 'FightAbr', code: 'abr' }, { id: 'FightApt', code: 'apt' }, { id: 'FightBlq', code: 'blq' },
    { id: 'FightChu', code: 'chu' }, { id: 'FightCmb', code: 'cmb' }, { id: 'FightCmm', code: 'cmm' },
    { id: 'FightDge', code: 'dge' }, { id: 'FightEmp', code: 'emp' }, { id: 'FightGch', code: 'gch' },
    { id: 'FightHit', code: 'hit' }, { id: 'FightJsl', code: 'jsl' }, { id: 'FightLut', code: 'lut' },
    { id: 'FightNck', code: 'nck' }, { id: 'FightPcl', code: 'pcl' }, { id: 'FightPrv', code: 'prv' },
    { id: 'FightSlm', code: 'slm' }, { id: 'FightUpc', code: 'upc' }, { id: 'FightZtd', code: 'ztd' }
];

// effets du pack (bundled/effect/<lib>.nitro), ajoutes a l'effectmap s'ils n'y sont pas
export const BOBBATOK_FIGHT_EFFECTS: { id: string; lib: string; type: string; label: string }[] = [
    { id: '6000', lib: 'AnimJump', type: 'fx', label: 'Saut' },
    { id: '6001', lib: 'AnimRun', type: 'fx', label: 'Course' },
    { id: '6100', lib: 'AnimPunch', type: 'fx', label: 'Coup de poing' },
    { id: '6101', lib: 'AnimPunch2', type: 'fx', label: 'Coup de poing (garde)' },
    { id: '6110', lib: 'FightPcl', type: 'fx', label: 'Coup de poing gauche' },
    { id: '6120', lib: 'FightHit', type: 'fx', label: 'Touché' },
    { id: '6121', lib: 'FightDge', type: 'fx', label: 'Esquive' },
    { id: '6122', lib: 'FightBlq', type: 'fx', label: 'Blocage' },
    { id: '6123', lib: 'FightLut', type: 'fx', label: 'En garde' },
    { id: '6130', lib: 'FightCmb', type: 'fx', label: 'Combo' },
    { id: '6131', lib: 'FightGch', type: 'fx', label: 'Crochet' },
    { id: '6132', lib: 'FightUpc', type: 'fx', label: 'Uppercut' },
    { id: '6133', lib: 'FightEmp', type: 'fx', label: 'Poussée' },
    { id: '6134', lib: 'FightChu', type: 'fx', label: 'Coup de pied' },
    { id: '6140', lib: 'FightZtd', type: 'fx', label: 'Étourdi' },
    { id: '6141', lib: 'FightNck', type: 'fx', label: 'K.O.' },
    { id: '6142', lib: 'FightCmm', type: 'fx', label: 'Victoire' },
    { id: '6143', lib: 'FightPrv', type: 'fx', label: 'Provocation' },
    { id: '6150', lib: 'FightApt', type: 'fx', label: 'Pointer du doigt' },
    { id: '6151', lib: 'FightAbr', type: 'fx', label: 'Câlin' },
    { id: '6152', lib: 'FightJsl', type: 'fx', label: 'Lancer de slime' },
    { id: '6153', lib: 'FightSlm', type: 'fx', label: 'Englué' }
];

export const withBobbatokFightEffects = <T extends { id?: string | number }>(effects: T[]): T[] =>
{
    const list = Array.isArray(effects) ? [ ...effects ] : [];
    const ids = new Set(list.map(effect => String(effect?.id)));

    for(const effect of BOBBATOK_FIGHT_EFFECTS) if(!ids.has(effect.id)) list.push(effect as unknown as T);

    return list;
};
