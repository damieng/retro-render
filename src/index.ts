import { Spectrum } from "./Platforms/Spectrum";

export async function renderRect(url: string, canvas: HTMLCanvasElement): Promise<void> {
    const screenBinary = await getBinary(url);
    Spectrum.DrawScreenToCanvas(new Uint8Array(screenBinary), canvas);
}

export async function renderPixel(url: string, canvas: HTMLCanvasElement): Promise<void> {
    Spectrum.DrawScreenToCanvas(new Uint8Array(await getBinary(url)), canvas);
}

function createOption(value: string, label: string): HTMLOptionElement {
    const option = <HTMLOptionElement>document.createElement('option');
    option.value = value;
    option.innerText = label;
    return option;
}

function clearOptions(select: HTMLSelectElement): void {
    while (select.options.length > 0)
        select.options.remove(select.options.length - 1);
}