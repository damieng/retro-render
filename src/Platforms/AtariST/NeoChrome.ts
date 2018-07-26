import { ImageDefinition } from "../../Common/ImageDefinition";
import { AtariST, Resolution } from "./AtariST";
import { ImageFileFormat } from "../../Common/FileFormat";

enum Offset {
    Flag,
    Resolution = 2,
    Palette = 4,
    Filename = 20,
    AnimationLimits = 32,
    AnimationSpeed = 34,
    ColorSteps = 36,
    OffsetX = 38,
    OffsetY = 40,
    Width = 42,
    Height = 44,
    Screen = 128
}

class OffsetCheck {
    constructor(
        public readonly message: string,
        public readonly offset: Offset,
        public readonly test: (word: number) => boolean) {
    }
}

const offsetChecks = new Array<OffsetCheck>(
    new OffsetCheck("flag0 is 0", Offset.Flag, (w) => w === 0),
    new OffsetCheck("resolution", Offset.Resolution, (w) => w <= 2),
    new OffsetCheck("offsetX is 0", Offset.OffsetX, (w) => w === 0),
    new OffsetCheck("offsetY is 0", Offset.OffsetY, (w) => w === 0),
    new OffsetCheck("width is 320", Offset.Width, (w) => w === 320),
    new OffsetCheck("height is 200", Offset.Height, (w) => w === 200),
)

export class NEOchrome implements ImageFileFormat {
    public GetFileExtensions(): string[] {
        return ['.neo'];
    }

    public GetMatchScore(buffer: ArrayBuffer): number {
        const dv = new DataView(buffer);

        let score = 0;
        if (dv.byteLength === 32128) score += 10;

        for (let check of offsetChecks)
            if (check.test(dv.getInt16(check.offset)))
                score += 10;

        const filename = dv.getAsciiFixed(Offset.Filename, 12);
        if (filename[8] === '.') score += 10;

        return score;
    }

    public GetMetadata(buffer: ArrayBuffer): Map<string, string> {
        const dv = new DataView(buffer);
        const map = new Map<string, string>();

        const palette = [];
        for (let i = 0; i < 15; i++)
            palette.push(dv.getInt16(Offset.Palette + i * 2).toString(2));

        map.set('flag', dv.getUint16(Offset.Flag).toString(16));
        map.set('resolution', Resolution[dv.getUint16(Offset.Resolution)]);
        map.set('palette', palette.join(', '));
        map.set('filename', dv.getAsciiFixed(Offset.Filename, 12));
        map.set('colorSteps', dv.getInt16(Offset.ColorSteps).toString());
        map.set('offsetX', dv.getInt16(Offset.OffsetX).toString());
        map.set('offsetY', dv.getInt16(Offset.OffsetX).toString());
        map.set('width', dv.getInt16(Offset.Width).toString());
        map.set('height', dv.getInt16(Offset.Height).toString());

        return map;
    }

    public GetImageDefinition(buffer: ArrayBuffer): ImageDefinition | null {
        const dv = new DataView(buffer);
        if (dv.getUint16(Offset.Flag) !== 0) return null;
        return AtariST.GetImageDefinition(dv.getInt16(2));
    }

    public RenderToImageData(buffer: ArrayBuffer, imageData: ImageData): void {
        const dv = new DataView(buffer);

        if (dv.getUint8(0) !== 0)
            throw new Error('Missing flag byte 0x00 at 0x00');

        const mode = <Resolution>dv.getInt16(Offset.Resolution);
        const def = AtariST.GetImageDefinition(mode);
        const pal = AtariST.GetPalette(buffer.slice(Offset.Palette, 16 * 2 + 4), def.colors);

        AtariST.RenderScreen(mode, buffer.slice(Offset.Screen), imageData, pal);
    }
}