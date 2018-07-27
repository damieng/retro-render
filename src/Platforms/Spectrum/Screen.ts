import { Color } from "../../Common/Color";
import { ImageDefinition } from "../../Common/ImageDefinition";
import { ImageFileFormat } from "../../Common/FileFormat";
import { Spectrum } from "./Spectrum";

export class SpectrumScreen implements ImageFileFormat {
    constructor() {
    }

    public GetFileExtensions(): string[] {
        return [".scr"];
    }

    public GetMatchScore(buffer: ArrayBuffer): number {
        return buffer.byteLength === 6912 || buffer.byteLength == 6144 ? 100 : 0;
    }

    public GetMetadata(buffer: ArrayBuffer): Map<string, string> {
        return new Map();
    }

    public GetImageDefinition(buffer: ArrayBuffer): ImageDefinition {
        switch (buffer.byteLength) {
            case 6912:
                return Spectrum.DisplayResolution;
            case 6144:
                return Spectrum.PixelResolution;
            default:
                return null;
        }
    }

    public RenderToImageData(buffer: ArrayBuffer, imageData: ImageData): void {
        if (buffer.byteLength !== 6912 && buffer.byteLength !== 6144)
            throw new Error('Only 6912 color and 6144 mono screen$ supported');

        this.DrawScreen(buffer, (x, y, color) => {
            const offset = (x + y * imageData.width) * 4;
            imageData.data[offset] = color.r;
            imageData.data[offset + 1] = color.g;
            imageData.data[offset + 2] = color.b;
            imageData.data[offset + 3] = color.a;
        });
    }

    private DrawScreen(buffer: ArrayBuffer, setter: (x: number, y: number, c: Color) => void): void {
        const screen = new Uint8Array(buffer);
        const heightCells = Spectrum.AttributeResolution.height;
        const widthCells = Spectrum.AttributeResolution.width;
        const attributeOffset = Spectrum.AttributeOffset;
        const lookupY = Spectrum.LookupY;

        for (let cellY = 0; cellY < heightCells; cellY++) {
            for (let cellX = 0; cellX < widthCells; cellX++) {
                const attribute = screen[cellY * widthCells + attributeOffset + cellX];
                const colors = Spectrum.GetAttributeColors(attribute);
                for (let pixelY = 0; pixelY < 8; pixelY++) {
                    const y = (cellY * 8) + pixelY;
                    const pixels = screen[lookupY[y] + cellX];
                    for (let pixelX = 0; pixelX < 8; pixelX++) {
                        const bit = 128 >> pixelX;
                        const x = (cellX * 8) + pixelX;
                        const color = colors[(pixels & bit) == bit ? 1 : 0];
                        setter(x, y, color);
                    }
                }
            }
        }
    }
}