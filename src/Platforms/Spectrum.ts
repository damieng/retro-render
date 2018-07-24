import { Color } from "../Common/Color";

export class Spectrum {
    constructor() {
    }

    public static DrawScreenToImageData(screen: Uint8Array, imageData: ImageData): boolean {
        if (imageData.width !== widthPixels || imageData.height !== heightPixels)
            throw new Error(`Image must be ${widthPixels}x${heightPixels} in size`)

        for (let cellY = 0; cellY < heightCells; cellY++) {
            for (let cellX = 0; cellX < widthCells; cellX++) {
                const attribute = screen[cellY * widthCells + attributeOffset + cellX];
                const bright = (attribute & 64) >> 3;
                const foreColor = palette[(attribute & 7) | bright];
                const backColor = palette[((attribute & 56) >> 3) | bright];
                for (let pixelY = 0; pixelY < 8; pixelY++) {
                    const y = (cellY * 8) + pixelY;
                    const pixelData = screen[lookupY[y] + cellX];
                    for (let pixelX = 0; pixelX < 8; pixelX++) {
                        const bit = 128 >> pixelX;
                        const x = (cellX * 8) + pixelX;
                        const offset = ((y * imageData.width) + x) * 4;
                        const color = (pixelData & bit) != 0 ? foreColor : backColor
                        imageData.data[offset] = color.r;
                        imageData.data[offset + 1] = color.g;
                        imageData.data[offset + 2] = color.b;
                        imageData.data[offset + 3] = 255;
                    }
                }
            }
        }
        return true;
    }

    public static GetPalette(index: number): Color {
        return palette[index];
    }
}

const widthCells = 32;
const heightCells = 24;
const widthPixels = 256;
const heightPixels = 192;
const attributeOffset = widthPixels * heightPixels / 8;

const lookupY = buildLookupY();;

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

const palette = [
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
    new Color(0xff, 0xff, 0xff),

];