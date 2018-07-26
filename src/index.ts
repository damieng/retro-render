import { ImageFileFormat } from "./Common/FileFormat";
import { GetRenderer } from "./Platforms/Format";

export function getRenderer(buffer: ArrayBuffer): ImageFileFormat {
    return GetRenderer(buffer);
}

export async function getAsTextLines(url: string): Promise<Array<string>> {
    const text = await getPlainText(url);
    return text.split('\n').map(t => t.trim());
}