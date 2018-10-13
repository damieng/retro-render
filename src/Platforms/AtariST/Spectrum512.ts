import { ImageDefinition } from "../../Common/ImageDefinition";
import { AtariST, Resolution } from "./AtariST";
import { ImageFileFormat } from "../../Common/FileFormat";
import { Color } from "../../Common/Color";

enum Offset {
    Palette = 32000
}

const Scanlines = 199;
const PalettesPerScanline = 3;
const ColorsPerPalette = 16;
const ColorsPerScanline = PalettesPerScanline * ColorsPerPalette;

export class Spectrum512 implements ImageFileFormat {
    public GetFileExtensions(): string[] {
        return ['.spu'];
    }

    public GetMatchScore(buffer: ArrayBuffer): number {
        const dv = new DataView(buffer);

        let score = 0;
        if (dv.byteLength === 51104) score = 100;

        return score;
    }

    public GetMetadata(buffer: ArrayBuffer): Map<string, string> {
        const dv = new DataView(buffer);
        const map = new Map<string, string>();

        const palette = [];
        for (let i = 0; i < 15; i++)
            palette.push(dv.getInt16(Offset.Palette + i * 2).toString(2));

        map.set('resolution', Resolution.Low.toString());
        map.set('palette', palette.join(', '));
        map.set('width', '320');
        map.set('height', '200');

        return map;
    }

    public GetImageDefinition(buffer: ArrayBuffer): ImageDefinition | null {
        const dv = new DataView(buffer);
        if (dv.byteLength !== 51104) return null;
        return AtariST.GetImageDefinition(Resolution.Low);
    }

    public RenderToImageData(buffer: ArrayBuffer, imageData: ImageData): void {
        const dv = new DataView(buffer);

        if (dv.byteLength !== 51104)
            throw new Error(`Incorrect length of ${dv.byteLength} but expected 51104`);

        const palette = Spectrum512.GetPalette(buffer.slice(Offset.Palette));

        let x = 0;
        let y = 0;
        let absIndex = 0;
        const getColor = (index: number) => {
            const lineIndex = Spectrum512.GetPaletteScanlineEntry(x++, index);
            if (x === 320) {
                x = 0;
                absIndex = y++ * ColorsPerScanline;
            }
            return palette[absIndex + lineIndex];
        }

        AtariST.RenderLowResolution(buffer, imageData, getColor);
    }

    private static paletteSlide = [ 1, 5, 21, 25, 41, 45, 61, 65, 81, 85, 101, 105, 121, 125, 141, 145 ];

    public static GetPaletteScanlineEntry(x: number, c: number): number {
        // Some kind of sliding window for the palette
        const x1 = Spectrum512.paletteSlide[c];
        if (x > x1 + 160)
            return c + 32;
        if (x > x1)
             return c + 16;
        return c;
    }

    public static GetPalette(buffer: ArrayBuffer): Color[] {
        const palette = new Array<Color>();
        const dv = new DataView(buffer);
        const paletteCount = Scanlines * PalettesPerScanline * ColorsPerPalette;
        for (let i = 0; i < paletteCount; i++) {
            const entry = dv.getUint16(i * 2, false);
            const red = entry >> 8 & 7;
            const green = entry >> 4 & 7;
            const blue = entry & 7;
            palette.push(new Color(red * 32, green * 32, blue * 32));
        }
        return palette;
    }
}