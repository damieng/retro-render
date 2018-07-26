import { Color } from "../../Common/Color";
import { ImageDefinition } from "../../Common/ImageDefinition";

export enum Resolution {
    Standard,
    Attribute
}

enum AttributeMask {
    Foreground = 0b00000111,
    Background = 0b00111000,
    Bright     = 0b01000000,
    Flash      = 0b10000000
}

export class Spectrum {
    public static readonly DisplayResolution = new ImageDefinition(256, 192, 16);
    public static readonly PixelResolution = new ImageDefinition(256, 192, 2);
    public static readonly AttributeResolution = new ImageDefinition(32, 24, 16);
    public static readonly AttributeOffset = 6144;

    public static GetImageDefinition(resolution: Resolution): ImageDefinition {
        switch (resolution) {
            case Resolution.Standard: return Spectrum.PixelResolution;
            case Resolution.Attribute: return Spectrum.AttributeResolution;
            default:
                throw new Error(`Unknown resolution ${resolution}`);
        }
    }

    public static GetAttributeColors(attribute: number): Color[] {
        const bright = (attribute & AttributeMask.Bright) >> 3;
        return [
            Spectrum.Palette[bright + ((attribute & AttributeMask.Background) >> 3)],
            Spectrum.Palette[bright + (attribute & AttributeMask.Foreground)],
        ];
    }

    public static readonly LookupY = buildLookupY();

    public static readonly Palette = [
        new Color(0, 0, 0),
        new Color(0, 0, 0xd7),
        new Color(0xd7, 0, 0),
        new Color(0xd7, 0, 0xd7),
        new Color(0, 0xd7, 0),
        new Color(0, 0xd7, 0xd7),
        new Color(0xd7, 0xd7, 0),
        new Color(0xd7, 0xd7, 0xd7),
        new Color(0, 0, 0),
        new Color(0, 0, 0xff),
        new Color(0xff, 0, 0),
        new Color(0xff, 0, 0xff),
        new Color(0, 0xff, 0),
        new Color(0, 0xff, 0xff),
        new Color(0xff, 0xff, 0),
        new Color(0xff, 0xff, 0xff)
    ]
}

function buildLookupY(): Uint16Array {
    const table = new Uint16Array(256);
    let pos = 0;
    for (let third = 0; third < 3; third++)
        for (let line = 0; line < 8; line++)
            for (let y = 0; y < 63; y += 8) {
                table[y + line + (third * 64)] = pos;
                pos += 32;
            }
    return table;
}
