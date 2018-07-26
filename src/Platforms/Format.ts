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
        allRenderers.get(Format.SpectrumScreen);
    return allRenderers.get(Format.NEOchrome);
}
