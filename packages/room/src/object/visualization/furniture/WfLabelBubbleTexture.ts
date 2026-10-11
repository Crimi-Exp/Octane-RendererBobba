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
export const createWfLabelBubbleTexture = (text: string): Texture =>
{
    ensureResources();

    if(!imagesReady || !text) return null;

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
    const mid = (bubbleImage.width - (s * 2));
    const innerW = (width - (s * 2));
    const innerH = (height - (s * 2));

    ctx.drawImage(bubbleImage, 0, 0, s, s, 0, 0, s, s);
    ctx.drawImage(bubbleImage, s, 0, mid, s, s, 0, innerW, s);
    ctx.drawImage(bubbleImage, (s + mid), 0, s, s, (width - s), 0, s, s);
    ctx.drawImage(bubbleImage, 0, s, s, mid, 0, s, s, innerH);
    ctx.drawImage(bubbleImage, s, s, mid, mid, s, s, innerW, innerH);
    ctx.drawImage(bubbleImage, (s + mid), s, s, mid, (width - s), s, s, innerH);
    ctx.drawImage(bubbleImage, 0, (s + mid), s, s, 0, (height - s), s, s);
    ctx.drawImage(bubbleImage, s, (s + mid), mid, s, s, (height - s), innerW, s);
    ctx.drawImage(bubbleImage, (s + mid), (s + mid), s, s, (width - s), (height - s), s, s);

    // Pointe centree (meme calcul que le CSS de l'editeur : 50 % - 8 px).
    ctx.drawImage(pointerImage, Math.floor((width / 2) - 8), (height - POINTER_OVERLAP), POINTER_WIDTH, POINTER_HEIGHT);

    // Texte : Ubuntu 11 / interligne 13, place comme dans la bulle officielle.
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = 'alphabetic';

    lines.forEach((line, index) => ctx.fillText(line, (s + PADDING_LEFT), (s + PADDING_TOP + TEXT_BASELINE + (index * LINE_HEIGHT))));

    return Texture.from(canvas);
};
