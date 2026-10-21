/**
 * BobbaTok :clic : le joueur a desactive le clic sur les autres avatars (et les bots, les animaux).
 * Le client ecrit le reglage (window.__bobbatokClic + localStorage 'bobbatok.clic') ; le renderer le lit ici.
 * Quand c'est actif, un clic sur un avatar n'ouvre rien : il traverse et le joueur marche sur la case.
 */
const STORAGE_KEY = 'bobbatok.clic';

const readStored = (): boolean =>
{
    try
    {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    }
    catch
    {
        return false;
    }
};

export const isClicPassThrough = (): boolean =>
{
    const live = (typeof window !== 'undefined') ? (window as unknown as { __bobbatokClic?: boolean }).__bobbatokClic : undefined;

    if(typeof live === 'boolean') return live;

    return (typeof window !== 'undefined') ? readStored() : false;
};
