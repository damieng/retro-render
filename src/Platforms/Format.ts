import { SpectrumScreen } from "./Spectrum/Screen";
import { NEOchrome } from "./AtariST/NeoChrome";
import { ImageFileFormat } from "../Common/FileFormat";

export enum Format {
    SpectrumScreen,
    NEOchrome
}

const allRenderers = new Map<Format, ImageFileFormat>([
    [Format.SpectrumScreen, new SpectrumScreen()],
    [Format.NEOchrome, new NEOchrome()]
]);

export function GetRenderer(buffer: ArrayBuffer): ImageFileFormat {
    if (buffer.byteLength === 6912 || buffer.byteLength === 6144)
        return allRenderers.get(Format.SpectrumScreen);
    if (buffer.byteLength === 32128)
       return allRenderers.get(Format.NEOchrome);
    throw new Error(`Not sure what to do with ${buffer.byteLength} long file`);
}
