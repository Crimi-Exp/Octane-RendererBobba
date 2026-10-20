import { Color, ColorSource, Filter, GlProgram } from 'pixi.js';

/** Types de surbrillance de wf_act_set_highlight, dans l'ordre de Habbo. */
export const WiredHighlightType = {
    OUTLINE: 0,
    SOFT_GLOW: 1,
    DARKEN: 2,
    COLOR_TINT: 3,
    BRIGHTEN: 4,
    NEON_AURA: 5
} as const;

export interface WiredHighlightEffectFilterOptions
{
    type: number;
    color: ColorSource;
    /** Intensite 0 a 1. */
    strength: number;
    /** true pour un avatar (un seul sprite : le contour se dessine autour de la silhouette). */
    outer: boolean;
    /** true : seulement l'effet autour de la silhouette, sans le dessin (calque sous un mobi). */
    knockout?: boolean;
}

/**
 * Surbrillance wf_act_set_highlight facon Habbo, en un seul filtre :
 * contour, lueur douce, assombrir, teinte de couleur, eclaircir et aura neon.
 * L'intensite (uStrength) peut etre animee image par image (pulsation, transition).
 */
export class WiredHighlightEffectFilter extends Filter
{
    public static readonly PADDING = 14;

    public uniforms: {
        uColor: Float32Array,
        uType: number,
        uStrength: number,
        uOuter: number,
        uKnockout: number
    };

    private _color: Color;

    constructor(options: WiredHighlightEffectFilterOptions)
    {
        const glProgram = GlProgram.from({
            vertex: `in vec2 aPosition;
            out vec2 vTextureCoord;

            uniform vec4 uInputSize;
            uniform vec4 uOutputFrame;
            uniform vec4 uOutputTexture;

            vec4 filterVertexPosition( void )
            {
                vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

                position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
                position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

                return vec4(position, 0.0, 1.0);
            }

            vec2 filterTextureCoord( void )
            {
                return aPosition * (uOutputFrame.zw * uInputSize.zw);
            }

            void main(void)
            {
                gl_Position = filterVertexPosition();
                vTextureCoord = filterTextureCoord();
            }`,
            fragment: `
            in vec2 vTextureCoord;
            out vec4 finalColor;

            uniform sampler2D uTexture;
            // Meme precision que dans le vertex shader, sinon le programme ne se lie pas.
            uniform highp vec4 uInputSize;
            uniform highp vec4 uInputClamp;
            uniform vec3 uColor;
            uniform float uType;
            uniform float uStrength;
            uniform float uOuter;
            uniform float uKnockout;

            float alphaAt(vec2 offset)
            {
                vec2 coord = vTextureCoord + (offset * uInputSize.zw);

                if(coord.x < uInputClamp.x || coord.y < uInputClamp.y || coord.x > uInputClamp.z || coord.y > uInputClamp.w) return 0.0;

                return texture(uTexture, coord).a;
            }

            float ringAt(float d)
            {
                float m = alphaAt(vec2(d, 0.0));
                m = max(m, alphaAt(vec2(-d, 0.0)));
                m = max(m, alphaAt(vec2(0.0, d)));
                m = max(m, alphaAt(vec2(0.0, -d)));
                float e = d * 0.7071;
                m = max(m, alphaAt(vec2(e, e)));
                m = max(m, alphaAt(vec2(-e, e)));
                m = max(m, alphaAt(vec2(e, -e)));
                m = max(m, alphaAt(vec2(-e, -e)));
                return m;
            }

            // Bord net : pixel transparent a moins de r px de la silhouette.
            float edgeWithin(float r)
            {
                float m = 0.0;
                for(float d = 1.0; d <= 4.0; d += 1.0)
                {
                    if(d > r) break;
                    m = max(m, ringAt(d));
                }
                return m;
            }

            // Lueur : decroit avec la distance a la silhouette.
            float glowWithin(float r)
            {
                float g = 0.0;
                for(float d = 1.0; d <= 12.0; d += 1.0)
                {
                    if(d > r) break;
                    g = max(g, ringAt(d) * (1.0 - (d / (r + 1.0))));
                }
                return g;
            }

            void main(void)
            {
                vec4 current = texture(uTexture, vTextureCoord);
                float s = clamp(uStrength, 0.0, 1.0);
                vec3 rgb = (current.a > 0.0) ? (current.rgb / current.a) : vec3(0.0);
                int type = int(uType + 0.5);

                if(type == 2)
                {
                    rgb *= (1.0 - 0.65 * s);
                    finalColor = vec4(rgb * current.a, current.a);
                    return;
                }

                if(type == 3)
                {
                    float k = 0.65 * min(1.0, s * 1.35);
                    rgb = rgb * ((1.0 - k) + (k * uColor)) + (uColor * (35.0 * s / 255.0));
                    finalColor = vec4(clamp(rgb, 0.0, 1.0) * current.a, current.a);
                    return;
                }

                if(type == 4)
                {
                    rgb = rgb * (1.0 + 0.78 * s) + vec3(36.0 * s / 255.0);
                    finalColor = vec4(clamp(rgb, 0.0, 1.0) * current.a, current.a);
                    return;
                }

                vec4 glow = vec4(0.0);

                if(type == 0)
                {
                    // Contour plein de 2 px autour de la silhouette.
                    float a = edgeWithin(2.0) * s;
                    glow = vec4(uColor * a, a);
                }
                else if(type == 1)
                {
                    // Lueur douce : halo d'environ 6 px qui s'estompe.
                    float a = clamp(glowWithin(3.0 + 3.0 * s) * 1.7, 0.0, 1.0) * 0.8 * s;
                    glow = vec4(uColor * a, a);
                }
                else
                {
                    // Aura neon : grand halo colore + liseré blanc contre la silhouette.
                    float a = clamp(glowWithin(7.0 + 5.0 * s) * 1.5, 0.0, 1.0) * 0.65 * s;
                    vec4 colored = vec4(uColor * a, a);
                    float w = edgeWithin(1.0) * 0.9 * s;
                    glow = vec4(vec3(w), w) + colored * (1.0 - w);
                }

                glow *= (1.0 - current.a);
                finalColor = (uKnockout > 0.5) ? glow : (current + glow);
            }
            `,
            name: 'wired-highlight-effect-filter',
        });

        super({
            gpuProgram: null,
            glProgram,
            padding: WiredHighlightEffectFilter.PADDING,
            resources: {
                wiredHighlightUniforms: {
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uType: { value: 0, type: 'f32' },
                    uStrength: { value: 1, type: 'f32' },
                    uOuter: { value: 0, type: 'f32' },
                    uKnockout: { value: 0, type: 'f32' }
                },
            },
        });

        this.uniforms = this.resources.wiredHighlightUniforms.uniforms;

        this._color = new Color();
        this.color = options?.color ?? 0xFFFFFF;
        this.type = options?.type ?? WiredHighlightType.OUTLINE;
        this.strength = options?.strength ?? 1;
        this.uniforms.uOuter = options?.outer ? 1 : 0;
        this.uniforms.uKnockout = options?.knockout ? 1 : 0;
    }

    public set color(value: ColorSource)
    {
        this._color.setValue(value);

        const [ r, g, b ] = this._color.toArray();

        this.uniforms.uColor[0] = r;
        this.uniforms.uColor[1] = g;
        this.uniforms.uColor[2] = b;
    }

    public get type(): number
    {
        return this.uniforms.uType;
    }

    public set type(value: number)
    {
        this.uniforms.uType = Math.max(0, Math.min(5, Math.floor(value) || 0));
    }

    public get strength(): number
    {
        return this.uniforms.uStrength;
    }

    public set strength(value: number)
    {
        this.uniforms.uStrength = Math.max(0, Math.min(1, isFinite(value) ? value : 0));
    }
}
