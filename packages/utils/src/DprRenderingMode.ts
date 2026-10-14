import { TextureSource } from 'pixi.js';

export type DprScaleMode = 'nearest' | 'linear';

export const GetDesiredScaleMode = (): DprScaleMode => 'nearest';

/** BobbaTok : au doigt (telephone, tablette), on dessine au plus en x2 : un ecran x3 coute 2,25 fois plus de pixels pour un rendu pixel art identique. */
export const MOBILE_MAX_RESOLUTION = 2;

const isTouchDevice = (): boolean =>
    (typeof window !== 'undefined') && (typeof window.matchMedia === 'function') && window.matchMedia('(pointer: coarse), (hover: none)').matches;

export const ResolveDesiredResolution = (dpr: number, touch: boolean): number =>
{
    const nearest = Math.round(dpr || 1);
    const resolution = (Math.abs((dpr || 1) - nearest) < 0.001) ? Math.max(1, nearest) : Math.max(1, Math.floor(dpr || 1));

    return touch ? Math.min(MOBILE_MAX_RESOLUTION, resolution) : resolution;
};

export const GetDesiredResolution = (): number => ResolveDesiredResolution(window.devicePixelRatio || 1, isTouchDevice());

export const StartDprRenderingModeWatcher = (): void =>
{
    if(typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    TextureSource.defaultOptions.scaleMode = 'nearest';

    const watch = (): void =>
    {
        const media = window.matchMedia(`(resolution: ${ window.devicePixelRatio }dppx)`);

        const onChange = (): void =>
        {
            media.removeEventListener('change', onChange);

            window.dispatchEvent(new Event('resize'));

            watch();
        };

        media.addEventListener('change', onChange);
    };

    watch();
};
