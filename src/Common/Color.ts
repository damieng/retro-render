export class Color {
    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number,
        public readonly a: number = 255) {
            if (r < 0 || r > 255)
                throw new Error('Argument r must be between 0 and 255');
            if (g < 0 || g > 255)
                throw new Error('Argument g must be between 0 and 255');
            if (b < 0 || b > 255)
                throw new Error('Argument b must be between 0 and 255');
            if (a < 0 || a > 255)
                throw new Error('Argument a must be between 0 and 255');
    }

    public toStyle(): string {        
        return this.a === 1
            ? `rgb(${this.r}, ${this.g}, ${this.b})`
            : `rgb(${this.r}, ${this.g}, ${this.b}), ${this.a})`;
    }
}