import { Color, ColorSource, Filter, GlProgram } from 'pixi.js';

/**
 * BobbaTok : surbrillance du menu clic droit (liste des objets sous le curseur, comme sur Habbo).
 * Couleurs relevees sur la video officielle : le corps du mobi est rempli de bleu 0x2C79F0 et ses contours
 * noirs deviennent bleu clair 0x7AC7F8, si bien que la forme du mobi reste lisible.
 */
export class PickerHighlightFilter extends Filter
{
    public static readonly DEFAULT_COLOR = 0x2C79F0;
    public static readonly DEFAULT_LINE_COLOR = 0x7AC7F8;

    private static _shared: PickerHighlightFilter = null;

    public uniforms: {
        uColor: Float32Array,
        uLineColor: Float32Array
    };

    private _color: Color;
    private _lineColor: Color;

    constructor(color: ColorSource = PickerHighlightFilter.DEFAULT_COLOR, lineColor: ColorSource = PickerHighlightFilter.DEFAULT_LINE_COLOR)
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
            uniform vec3 uColor;
            uniform vec3 uLineColor;

            void main(void)
            {
                vec4 current = texture(uTexture, vTextureCoord);
                float alpha = current.a;

                if(alpha <= 0.0)
                {
                    finalColor = vec4(0.0);
                    return;
                }

                // Texture premultipliee : un pixel noir (contour) a ses trois composantes a zero.
                bool isLine = (max(current.r, max(current.g, current.b)) <= (0.02 * alpha));
                vec3 color = isLine ? uLineColor : uColor;

                finalColor = vec4(color * alpha, alpha);
            }
            `,
            name: 'picker-highlight-filter',
        });

        super({
            gpuProgram: null,
            glProgram,
            resources: {
                pickerHighlightUniforms: {
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uLineColor: { value: new Float32Array(3), type: 'vec3<f32>' }
                },
            },
        });

        this.uniforms = this.resources.pickerHighlightUniforms.uniforms;

        this._color = new Color();
        this._lineColor = new Color();
        this.color = color;
        this.lineColor = lineColor;
    }

    /** Filtre partage (une seule surbrillance a la fois dans le menu). */
    public static get shared(): PickerHighlightFilter
    {
        if(!PickerHighlightFilter._shared) PickerHighlightFilter._shared = new PickerHighlightFilter();

        return PickerHighlightFilter._shared;
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

    public get lineColor(): ColorSource
    {
        return this._lineColor.value;
    }

    public set lineColor(value: ColorSource)
    {
        this._lineColor.setValue(value);

        const [ r, g, b ] = this._lineColor.toArray();

        this.uniforms.uLineColor[0] = r;
        this.uniforms.uLineColor[1] = g;
        this.uniforms.uLineColor[2] = b;
    }
}
