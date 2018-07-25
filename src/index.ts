import { Spectrum } from "./Platforms/Spectrum";

export async function renderRect(url: string, canvas: HTMLCanvasElement): Promise<void> {
    const screenBinary = await getBinary(url);
    Spectrum.DrawScreenToCanvas(new Uint8Array(screenBinary), canvas);
}

export async function renderPixel(url: string, canvas: HTMLCanvasElement): Promise<void> {
    Spectrum.DrawScreenToCanvas(new Uint8Array(await getBinary(url)), canvas);
}

export async function getAsTextLines(url: string): Promise<Array<string>> {
    const text = await getPlainText(url);
    return text.split('\n').map(t => t.trim());
}