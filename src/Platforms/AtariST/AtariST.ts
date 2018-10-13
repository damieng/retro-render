import { ImageDefinition } from '../../Common/ImageDefinition';
import { Color } from '../../Common/Color';

export enum Resolution { Low, Medium, High };

export class AtariST {
    public static readonly LowResolution = new ImageDefinition(320, 200, 16);
    public static readonly MediumResolution = new ImageDefinition(640, 200, 4);
    public static readonly HighResolution = new ImageDefinition(640, 400, 2);

    public static GetImageDefinition(resolution: Resolution): ImageDefinition {
        switch (resolution) {
            case Resolution.Low: return AtariST.LowResolution;
            case Resolution.Medium: return AtariST.MediumResolution;
            case Resolution.High: return AtariST.HighResolution;
            default:
                throw new Error(`Unknown resolution ${resolution}`);
        }
    }

    public static GetPalette(buffer: ArrayBuffer, count: number): Color[] {
        const palette = new Array<Color>();
        const dv = new DataView(buffer);
        for (let i = 0; i < count; i++) {
            const entry = dv.getUint16(i * 2, false);
            const red = entry >> 8 & 7;
            const green = entry >> 4 & 7;
            const blue = entry & 7;
            palette.push(new Color(red * 32, green * 32, blue * 32));
        }
        return palette;
    }

    public static RenderScreen(resolution: Resolution, buffer: ArrayBuffer, imageData: ImageData, palette: Color[]): void {
        var getColor = (index: number) => palette[index];
        switch (resolution) {
            case Resolution.Low: return AtariST.RenderLowResolution(buffer, imageData, getColor);
            case Resolution.Medium: return AtariST.RenderMediumResolution(buffer, imageData, getColor);
            case Resolution.High: return AtariST.RenderHighResolution(buffer, imageData, getColor);
            default:
                throw new Error(`Unknown resolution ${resolution}`);
        }
    }

    public static RenderLowResolution(buffer: ArrayBuffer, imageData: ImageData, getColor: (index: number) => Color): void {
        const dv = new DataView(buffer);
        const data = imageData.data;

        let o = 0;
        for (let i = 0; i < buffer.byteLength - 7; i = i + 8) {
            // ST Low-Res screen layout is 4 bitplanes interleaved 16 pixels (2 bytes) at a time
            const plane0 = dv.getUint16(i, false);
            const plane1 = dv.getUint16(i + 2, false);
            const plane2 = dv.getUint16(i + 4, false);
            const plane3 = dv.getUint16(i + 6, false);
            for (let pixel = 0; pixel < 16; pixel++) {
                const mask = 1 << (15 - pixel);
                const color = getColor(
                    ((plane0 & mask) === mask ? 1 : 0) |
                    ((plane1 & mask) === mask ? 2 : 0) |
                    ((plane2 & mask) === mask ? 4 : 0) |
                    ((plane3 & mask) === mask ? 8 : 0));
                data[o++] = color.r;
                data[o++] = color.g;
                data[o++] = color.b;
                data[o++] = color.a;
            }
        }
    }

    public static RenderMediumResolution(buffer: ArrayBuffer, imageData: ImageData, getColor: (index: number) => Color): void {
        const dv = new DataView(buffer);
        const data = imageData.data;

        let o = 0;
        for (let i = 0; i < buffer.byteLength; i = i + 4) {
            // ST Med-Res screen layout is 2 bitplanes interleaved 16 pixels (2 bytes) at a time
            const plane0 = dv.getUint16(i, false);
            const plane1 = dv.getUint16(i + 2, false);
            for (let pixel = 0; pixel < 16; pixel++) {
                const mask = 1 << (15 - pixel);
                const color = getColor(
                    ((plane0 & mask) === mask ? 1 : 0) |
                    ((plane1 & mask) === mask ? 2 : 0));
                data[o++] = color.r;
                data[o++] = color.g;
                data[o++] = color.b;
                data[o++] = color.a;
            }
        }
    }

    public static RenderHighResolution(buffer: ArrayBuffer, imageData: ImageData, getColor: (index: number) => Color): void {
        const dv = new DataView(buffer);
        const data = imageData.data;

        let o = 0;
        for (let i = 0; i < dv.byteLength; i = i + 2) {
            // ST Hi-Res screen layout is 1 bitplane so no interleaving
            const plane0 = dv.getUint16(i, false);
            for (let pixel = 0; pixel < 16; pixel++) {
                const mask = 1 << (15 - pixel);
                const color = getColor((plane0 & mask) === mask ? 1 : 0);
                data[o++] = color.r;
                data[o++] = color.g;
                data[o++] = color.b;
                data[o++] = color.a;
            }
        }
    }
}