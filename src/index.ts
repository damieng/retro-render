import { Spectrum } from "./Platforms/Spectrum";
import { Neochrome } from "./Platforms/AtariST/NeoChrome";

export async function renderSpectrum(url: string, canvas: HTMLCanvasElement): Promise<void> {
    Spectrum.DrawScreenToCanvas(await getBinary(url), canvas);
}

export async function renderNeo(url: string, canvas: HTMLCanvasElement): Promise<void> {
    Neochrome.DrawScreenToCanvas(await getBinary(url), canvas);
}

export async function getAsTextLines(url: string): Promise<Array<string>> {
    const text = await getPlainText(url);
    return text.split('\n').map(t => t.trim());
}