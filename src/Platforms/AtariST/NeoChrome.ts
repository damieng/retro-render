import { ImageDefinition } from "../../Common/ImageDefinition";
import { AtariST, Resolution } from "./AtariST";

export class Neochrome {
    constructor() {
    }

    public static GetFileExtensions(): string[] {
        return [ ".neo" ];
    }
    
    public static GetImageDefinition(buffer: ArrayBuffer): ImageDefinition {
        const dv = new DataView(buffer);
        if (dv.getUint16(0) !== 0) return null;

        return AtariST.GetImageDefinition(dv.getInt16(2));
    }

    public static DrawScreenToCanvas(buffer: ArrayBuffer, canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        this.DrawScreenViaImageData(buffer, imageData);
        context.putImageData(imageData, 0, 0);        
    }

    public static DrawScreenViaImageData(buffer: ArrayBuffer, imageData: ImageData): void {
        const dv = new DataView(buffer);

        if (dv.getUint8(0) !== 0)
            throw new Error('Missing flag byte 0x00 at 0x00');
     
        const mode = <Resolution>dv.getInt16(2);
        const def = AtariST.GetImageDefinition(mode);
        const pal = AtariST.GetPalette(buffer.slice(4, 16 * 2 + 4), def.colors);

        AtariST.RenderScreen(mode, buffer.slice(128), imageData, pal);
    }
}