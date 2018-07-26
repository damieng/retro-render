import { ImageDefinition } from "./ImageDefinition";

export interface FileFormat {
    GetFileExtensions(): string[];
    GetMatchScore(buffer: ArrayBuffer): number;
    GetMetadata(buffer: ArrayBuffer): Map<string, string>;
}

export interface ImageFileFormat extends FileFormat {
    GetImageDefinition(buffer: ArrayBuffer): ImageDefinition;
    RenderToImageData(screen: ArrayBuffer, imageData: ImageData): void;
}