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

        const data = imageData.data;
        const palette = Spectrum512.GetPalette(buffer.slice(Offset.Palette));

        let o = 0;
        let x = 0;
        let y = 0;
        let absIndex = 0;
        for (let i = 0; i < Offset.Palette - 7; i = i + 8) {
            // ST Low-Res screen layout is 4 bitplanes interleaved 16 pixels (2 bytes) at a time
            const plane0 = dv.getUint16(i, false);
            const plane1 = dv.getUint16(i + 2, false);
            const plane2 = dv.getUint16(i + 4, false);
            const plane3 = dv.getUint16(i + 6, false);
            for (let pixel = 0; pixel < 16; pixel++) {
                x++;
                const mask = 1 << (15 - pixel);
                const palIdx = 
                    ((plane0 & mask) === mask ? 1 : 0) |
                    ((plane1 & mask) === mask ? 2 : 0) |
                    ((plane2 & mask) === mask ? 4 : 0) |
                    ((plane3 & mask) === mask ? 8 : 0);
                const lineIndex = Spectrum512.GetPaletteScanlineEntry(x, palIdx)
                const color = palette[absIndex + lineIndex];
                data[o++] = color.r;
                data[o++] = color.g;
                data[o++] = color.b;
                data[o++] = color.a;
            }
            if (x === 320) {
                x = 0;
                absIndex = y++ * ColorsPerScanline;
            }
        }
    }

    private static paletteSlide = [ 1, 5, 21, 25, 41, 45, 61, 65, 81, 85, 101, 105, 121, 125, 141, 145 ];

    public static GetPaletteScanlineEntry(x: number, c: number): number {
        // Some kind of sliding palette window that confuses me
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