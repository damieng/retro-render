import { ImageFileFormat } from "../Common/FileFormat";

import { SpectrumScreen } from "./Spectrum/Screen";
import { NEOchrome } from "./AtariST/NeoChrome";
import { Spectrum512 } from "./AtariST/Spectrum512";

export enum Format {
    SpectrumScreen,
    NEOchrome,
    Spectrum512
}

const allRenderers = new Map<Format, ImageFileFormat>([
    [Format.SpectrumScreen, new SpectrumScreen()],
    [Format.NEOchrome, new NEOchrome()],
    [Format.Spectrum512, new Spectrum512()]
]);

export function GetRenderer(buffer: ArrayBuffer): ImageFileFormat {
    switch(buffer.byteLength) {
        case 6912:
        case 6144:  return allRenderers.get(Format.SpectrumScreen);
        case 32128: return allRenderers.get(Format.NEOchrome);
        case 51104: return allRenderers.get(Format.Spectrum512);
        default:
            throw new Error(`Not sure what to do with ${buffer.byteLength} long file`);
    }
}
