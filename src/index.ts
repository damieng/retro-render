import { Spectrum } from "./Platforms/Spectrum";

const byId = (id: string) => document.getElementById(id);

export async function render(url: string, canvas: HTMLCanvasElement): Promise<void> {
    const screenBinary = await getBinary(url);
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    Spectrum.DrawScreenToImageData(new Uint8Array(screenBinary), imageData);
    context.putImageData(imageData, 0, 0);
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