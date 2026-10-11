import { Color, ColorSource, Filter, GlProgram } from 'pixi.js';

export interface WiredOutlineFilterOptions
{
    /** Couleur du contour et de la teinte. */
    color: ColorSource;
    /** Part de la couleur melangee au corps, 0 a 1. */
    tint?: number;
}

/**
 * Surbrillance wf_act_set_highlight des avatars : contour plein de 2 px autour de la silhouette (pixels
 * transparents touchant un pixel visible) et legere teinte du corps. Un avatar est un seul sprite, son
 * contour suit donc exactement sa silhouette.
 */
export class WiredOutlineFilter extends Filter
{
    public static readonly THICKNESS = 2;
    public static readonly DEFAULT_TINT = 0.28;

    public uniforms: {
        uColor: Float32Array,
        uTint: number
    };

    private _color: Color;

    constructor(options: WiredOutlineFilterOptions)
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
            uniform float uTint;

            float alphaAt(vec2 offset)
            {
                vec2 coord = vTextureCoord + (offset * uInputSize.zw);

                if(coord.x < uInputClamp.x || coord.y < uInputClamp.y || coord.x > uInputClamp.z || coord.y > uInputClamp.w) return 0.0;

                return texture(uTexture, coord).a;
            }

            void main(void)
            {
                vec4 current = texture(uTexture, vTextureCoord);

                if(current.a > 0.0)
                {
                    // Texture premultipliee : on teinte la couleur reelle puis on remultiplie.
                    vec3 rgb = mix(current.rgb / current.a, uColor, uTint);

                    finalColor = vec4(rgb * current.a, current.a);
                    return;
                }

                float edge = 0.0;

                for(float d = 1.0; d <= ${WiredOutlineFilter.THICKNESS}.0; d += 1.0)
                {
                    edge = max(edge, alphaAt(vec2(d, 0.0)));
                    edge = max(edge, alphaAt(vec2(-d, 0.0)));
                    edge = max(edge, alphaAt(vec2(0.0, d)));
                    edge = max(edge, alphaAt(vec2(0.0, -d)));
                    edge = max(edge, alphaAt(vec2(d, d)));
                    edge = max(edge, alphaAt(vec2(-d, d)));
                    edge = max(edge, alphaAt(vec2(d, -d)));
                    edge = max(edge, alphaAt(vec2(-d, -d)));
                }

                finalColor = (edge > 0.0) ? vec4(uColor, 1.0) : vec4(0.0);
            }
            `,
            name: 'wired-outline-filter',
        });

        super({
            gpuProgram: null,
            glProgram,
            padding: WiredOutlineFilter.THICKNESS + 1,
            resources: {
                wiredOutlineUniforms: {
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uTint: { value: WiredOutlineFilter.DEFAULT_TINT, type: 'f32' }
                },
            },
        });

        this.uniforms = this.resources.wiredOutlineUniforms.uniforms;

        this._color = new Color();
        this.color = options?.color ?? 0xFFFFFF;
        this.tint = options?.tint ?? WiredOutlineFilter.DEFAULT_TINT;
    }

    public get color(): ColorSource
    {
        return this._color.value;
    }

    public set color(value: ColorSource)
    {
        this._color.setValue(value);

        const [ r, g, b ] = this._color.toArray();

        this.uniforms.uColor[0] = r;
        this.uniforms.uColor[1] = g;
        this.uniforms.uColor[2] = b;
    }

    public get tint(): number
    {
        return this.uniforms.uTint;
    }

    public set tint(value: number)
    {
        this.uniforms.uTint = Math.max(0, Math.min(1, value));
    }
}
