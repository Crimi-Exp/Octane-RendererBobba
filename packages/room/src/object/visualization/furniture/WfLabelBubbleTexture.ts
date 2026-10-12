import { Texture } from 'pixi.js';

// wf_label : bulle officielle (« Document your wired setups ») reprise pixel par pixel.
// Cadre 9-slice 15 x 15 (7 px de bord) et pointe 17 x 9, a l'echelle du jeu.
const BUBBLE_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAABPUlEQVR4nKWTzU4CQQyAv3Z/2AsSg4j6PogcuPigxMQDIs9jBFQMMcZlFqYeWBYWVj3YZDKdab9pJ22FAxERw2qH1wAYqZR8d0rbIKDbu8VZcgSG9sF4dA+sMaZSwMKVdbp9VCMAnl4/9yAPwPlFA8uWAIxHdxhTCfdff59/4VyKBr6422qTyQthKJydRoVNhcQ63T4AzqWgpfdKsloZANe9G4TEFFmykjrPc4cPPF7cjzDAbAaZtUCW6K+ef8h/YSUKHWopSrxniCsBL45YUkA3kWXtuWw1y05U/73dPCmnPRoOsEDxOJQYtc2qTFUjRsMBAKHZWgRsGz1bxcznb5URJarh80bJORCSTQFp5DWs432G6a5ZFMfj8AFYbGBS2evtxKCRn4J8X1ckvigGRA5NImK7CnoK3aKjqfoGDy17G0rkAacAAAAASUVORK5CYII=';
const POINTER_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAxklEQVR4nI2SQU7CUBRFz+3/A4xMkFTDfkwq0T04NibuhrgLZqSQuB8TCDKByIB6HdA2FFPLHf2XvHv+GTxlT28G+Cm++drsOBxMV2IUN4NrknAFgMSdIQBwP35kudp2Qm7TPh/5rJwKBFhSvZA9vPK5WrcCRumQxXxSz7ZJANmWbQEs8imjdNgOyKdVueqcKJSRgo9GLw2jo8F7CSgaveQcUi2cGjUNij8ft0YKloKz8bOrd+vuvyB6ddHsLzc4T4yx83B+ARadTJc1dj9hAAAAAElFTkSuQmCC';

const SLICE = 7;
const MIN_WIDTH = 130;
const MAX_WIDTH = 196;
const MIN_HEIGHT = 68;
const PADDING_LEFT = 3;
const PADDING_RIGHT = 17;
const PADDING_TOP = 3;
const PADDING_BOTTOM = 2;
const LINE_HEIGHT = 13;
// Ligne de base de la 1re ligne dans sa boite de 13 px (Ubuntu 11 px : demi-interligne + ascendante).
const TEXT_BASELINE = 10;
const FONT = '11px UbuntuRegular, Ubuntu, sans-serif';
const TEXT_COLOR = '#ffffff';
// La pointe recouvre le bas de la bulle sur 3 px et depasse de 6 px.
const POINTER_OVERLAP = 3;
const POINTER_WIDTH = 17;
const POINTER_HEIGHT = 9;

/**
 * Couleurs de la bulle. Le paquet de sauvegarde des post-its n'accepte que ses 8 couleurs : chaque couleur de
 * bulle est donc rangee sous un de ces codes (« code texte » dans les donnees du mobi). FFFF33, la couleur
 * envoyee jusqu'ici, garde la bulle bleue officielle : les labels existants ne changent pas.
 * hue : teinte imposee en degres (-1 = garder celle de l'asset) ; saturation : multiplicateur (0 = gris).
 */
export interface WfLabelColor
{
    code: string;
    name: string;
    hue: number;
    saturation: number;
    /** Couleur de la pastille du selecteur. */
    swatch: string;
}

export const WF_LABEL_DEFAULT_COLOR = 'FFFF33';

export const WF_LABEL_COLORS: WfLabelColor[] = [
    { code: 'FFFF33', name: 'Bleu', hue: -1, saturation: 1, swatch: '#2f3459' },
    { code: '9CFF9C', name: 'Vert', hue: 125, saturation: 2, swatch: '#22762a' },
    { code: '9CFFE8', name: 'Turquoise', hue: 178, saturation: 2, swatch: '#1f7570' },
    { code: 'C69CFF', name: 'Violet', hue: 272, saturation: 1.8, swatch: '#4f2a86' },
    { code: 'FF9CFF', name: 'Rose', hue: 318, saturation: 2, swatch: '#7a2364' },
    { code: 'FF9C9C', name: 'Rouge', hue: 0, saturation: 2.4, swatch: '#8a1b1b' },
    { code: 'FFC69C', name: 'Orange', hue: 26, saturation: 2.6, swatch: '#8f4a12' },
    { code: '9CCEFF', name: 'Gris', hue: -1, saturation: 0, swatch: '#434343' }
];

/** Couleur du label (prefixe « RRGGBB » des donnees) ; une couleur inconnue donne la bulle bleue. */
export const getWfLabelColor = (data: string): string =>
{
    const match = /^([0-9A-Fa-f]{6})(?: |$)/.exec(data || '');
    const code = (match ? match[1].toUpperCase() : WF_LABEL_DEFAULT_COLOR);

    return WF_LABEL_COLORS.some(color => (color.code === code)) ? code : WF_LABEL_DEFAULT_COLOR;
};

/** Hauteur dont la pointe depasse sous la bulle. */
export const WF_LABEL_POINTER_OVERHANG = (POINTER_HEIGHT - POINTER_OVERLAP);

let bubbleImage: HTMLImageElement = null;
let pointerImage: HTMLImageElement = null;
let imagesReady = false;
let readyVersion = 0;

const loadImage = (src: string, done: () => void): HTMLImageElement =>
{
    const image = new Image();

    image.onload = done;
    image.src = src;

    return image;
};

/** Charge les assets et la police une seule fois ; chaque etape franchie incremente la version. */
const ensureResources = (): void =>
{
    if(bubbleImage || (typeof document === 'undefined') || (typeof Image === 'undefined')) return;

    let loaded = 0;

    const onImage = () =>
    {
        loaded++;

        if(loaded < 2) return;

        imagesReady = true;
        readyVersion++;
    };

    bubbleImage = loadImage(BUBBLE_PNG, onImage);
    pointerImage = loadImage(POINTER_PNG, onImage);

    const fonts = document.fonts;

    if(!fonts || !fonts.load) return;

    // Une fois la police du jeu chargee, la bulle est redessinee avec elle.
    fonts.load(FONT).then(() => readyVersion++).catch(() => readyVersion++);
};

const rgbToHsl = (r: number, g: number, b: number): [ number, number, number ] =>
{
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = ((max + min) / 2);

    if(max === min) return [ 0, 0, l ];

    const d = (max - min);
    const s = (l > 0.5) ? (d / (2 - max - min)) : (d / (max + min));
    let h = (max === r) ? (((g - b) / d) + ((g < b) ? 6 : 0)) : (max === g) ? (((b - r) / d) + 2) : (((r - g) / d) + 4);

    h /= 6;

    return [ h, s, l ];
};

const hslToRgb = (h: number, s: number, l: number): [ number, number, number ] =>
{
    if(s === 0) return [ l, l, l ];

    const hue2rgb = (p: number, q: number, t: number): number =>
    {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < (1 / 6)) return (p + ((q - p) * 6 * t));
        if(t < (1 / 2)) return q;
        if(t < (2 / 3)) return (p + ((q - p) * ((2 / 3) - t) * 6));
        return p;
    };

    const q = (l < 0.5) ? (l * (1 + s)) : ((l + s) - (l * s));
    const p = ((2 * l) - q);

    return [ hue2rgb(p, q, h + (1 / 3)), hue2rgb(p, q, h), hue2rgb(p, q, h - (1 / 3)) ];
};

/** Recolore un asset : meme luminosite, teinte et saturation de la couleur choisie. */
const recolor = (image: HTMLImageElement, color: WfLabelColor): HTMLCanvasElement =>
{
    const canvas = document.createElement('canvas');

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');

    if(!ctx) return canvas;

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;

    for(let i = 0; i < px.length; i += 4)
    {
        if(!px[i + 3]) continue;

        let [ h, s, l ] = rgbToHsl((px[i] / 255), (px[i + 1] / 255), (px[i + 2] / 255));

        if(color.hue >= 0) h = (color.hue / 360);

        s = Math.min(1, (s * color.saturation));

        const [ r, g, b ] = hslToRgb(h, s, l);

        px[i] = Math.round(r * 255);
        px[i + 1] = Math.round(g * 255);
        px[i + 2] = Math.round(b * 255);
    }

    ctx.putImageData(data, 0, 0);

    return canvas;
};

const coloredAssets = new Map<string, { bubble: CanvasImageSource; pointer: CanvasImageSource; bubbleUrl: string; pointerUrl: string }>();

/** Cadre et pointe de la bulle dans une couleur (bleu officiel = assets d'origine) ; null tant qu'ils chargent. */
const getColoredAssets = (code: string) =>
{
    ensureResources();

    if(!imagesReady) return null;

    const color = (WF_LABEL_COLORS.find(entry => (entry.code === code)) || WF_LABEL_COLORS[0]);
    let assets = coloredAssets.get(color.code);

    if(!assets)
    {
        if(color.code === WF_LABEL_DEFAULT_COLOR)
        {
            assets = { bubble: bubbleImage, pointer: pointerImage, bubbleUrl: BUBBLE_PNG, pointerUrl: POINTER_PNG };
        }
        else
        {
            const bubble = recolor(bubbleImage, color);
            const pointer = recolor(pointerImage, color);

            assets = { bubble, pointer, bubbleUrl: bubble.toDataURL(), pointerUrl: pointer.toDataURL() };
        }

        coloredAssets.set(color.code, assets);
    }

    return assets;
};

/** Images (data URL) du cadre et de la pointe pour l'editeur du client ; null tant qu'elles chargent. */
export const getWfLabelBubbleImages = (code: string): { bubble: string; pointer: string } =>
{
    const assets = getColoredAssets(code);

    return assets ? { bubble: assets.bubbleUrl, pointer: assets.pointerUrl } : null;
};

/** Change quand une ressource vient d'etre chargee : la bulle doit alors etre redessinee. */
export const getWfLabelBubbleResourceVersion = (): number =>
{
    ensureResources();

    return readyVersion;
};

/** Texte du label : l'emulateur stocke « couleur texte » (paquet de sauvegarde des post-its). */
export const getWfLabelText = (data: string): string => (data || '').replace(/^[0-9A-Fa-f]{6}(?: |$)/, '');

/** Decoupe comme le CSS de la bulle : par mots, puis par caracteres pour un mot plus long que la ligne. */
const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): { lines: string[]; longest: number } =>
{
    const lines: string[] = [];
    let longest = 0;

    for(const paragraph of text.split('\n'))
    {
        longest = Math.max(longest, ctx.measureText(paragraph).width);

        let line = '';

        for(const word of paragraph.split(/(\s+)/))
        {
            if(!word) continue;

            const candidate = (line + word);

            if(!line || (ctx.measureText(candidate).width <= maxWidth))
            {
                line = candidate;
            }
            else
            {
                lines.push(line.replace(/\s+$/, ''));
                line = word.replace(/^\s+/, '');
            }

            while(ctx.measureText(line).width > maxWidth)
            {
                let cut = (line.length - 1);

                while((cut > 1) && (ctx.measureText(line.slice(0, cut)).width > maxWidth)) cut--;

                lines.push(line.slice(0, cut));
                line = line.slice(cut);
            }
        }

        lines.push(line);
    }

    return { lines, longest };
};

/** Dessine la bulle (cadre, texte, pointe) ; null si pas de texte ou tant que les assets ne sont pas charges. */
export const createWfLabelBubbleTexture = (text: string, colorCode: string = WF_LABEL_DEFAULT_COLOR): Texture =>
{
    ensureResources();

    if(!imagesReady || !text) return null;

    const assets = getColoredAssets(colorCode);

    if(!assets) return null;

    const bubble = assets.bubble;
    const pointer = assets.pointer;

    const measure = document.createElement('canvas').getContext('2d');

    if(!measure) return null;

    measure.font = FONT;

    const s = SLICE;
    const contentMax = (MAX_WIDTH - (s * 2) - PADDING_LEFT - PADDING_RIGHT);
    const { lines, longest } = wrapText(measure, text, contentMax);
    const width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, (Math.ceil(longest) + (s * 2) + PADDING_LEFT + PADDING_RIGHT)));
    const height = Math.max(MIN_HEIGHT, ((s * 2) + PADDING_TOP + PADDING_BOTTOM + (lines.length * LINE_HEIGHT)));

    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = (height + WF_LABEL_POINTER_OVERHANG);

    const ctx = canvas.getContext('2d');

    if(!ctx) return null;

    ctx.imageSmoothingEnabled = false;

    // Cadre 9-slice : coins fixes, bords et centre etires a partir du pixel central de l'asset.
    const mid = ((bubbleImage.width) - (s * 2));
    const innerW = (width - (s * 2));
    const innerH = (height - (s * 2));

    ctx.drawImage(bubble, 0, 0, s, s, 0, 0, s, s);
    ctx.drawImage(bubble, s, 0, mid, s, s, 0, innerW, s);
    ctx.drawImage(bubble, (s + mid), 0, s, s, (width - s), 0, s, s);
    ctx.drawImage(bubble, 0, s, s, mid, 0, s, s, innerH);
    ctx.drawImage(bubble, s, s, mid, mid, s, s, innerW, innerH);
    ctx.drawImage(bubble, (s + mid), s, s, mid, (width - s), s, s, innerH);
    ctx.drawImage(bubble, 0, (s + mid), s, s, 0, (height - s), s, s);
    ctx.drawImage(bubble, s, (s + mid), mid, s, s, (height - s), innerW, s);
    ctx.drawImage(bubble, (s + mid), (s + mid), s, s, (width - s), (height - s), s, s);

    // Pointe centree (meme calcul que le CSS de l'editeur : 50 % - 8 px).
    ctx.drawImage(pointer, Math.floor((width / 2) - 8), (height - POINTER_OVERLAP), POINTER_WIDTH, POINTER_HEIGHT);

    // Texte : Ubuntu 11 / interligne 13, place comme dans la bulle officielle.
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = 'alphabetic';

    lines.forEach((line, index) => ctx.fillText(line, (s + PADDING_LEFT), (s + PADDING_TOP + TEXT_BASELINE + (index * LINE_HEIGHT))));

    return Texture.from(canvas);
};
