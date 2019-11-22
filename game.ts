class FallingSandGame {
    readonly canvas: HTMLCanvasElement;
    readonly world: Uint8Array;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.world = new Uint8Array(canvas.width * canvas.height);
    }

    draw() {
        const ctx = this.canvas.getContext("2d");
        const imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
        const unknownRGB = [236, 66, 245];
        for (let i = 0; i < this.canvas.width * this.canvas.height; i++) {
            const cell = this.world[i];
            const [r, g, b] = Color[this.world[i]] || unknownRGB;
            imageData.data[4 * i + 0] = r;
            imageData.data[4 * i + 1] = g;
            imageData.data[4 * i + 2] = b;
            imageData.data[4 * i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }
}

enum Species {
    Empty = 0,
}

const Color = {
    [Species.Empty]: [0, 0, 0],
};
