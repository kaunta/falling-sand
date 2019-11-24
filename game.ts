class FallingSandGame {
    readonly canvas: HTMLCanvasElement;
    readonly world: Uint8Array;
    drawing: boolean = false;
    brush: Species = Species.Wall;
    brushSize: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.world = new Uint8Array(canvas.width * canvas.height);

        this.canvas.addEventListener('mousedown', penDown(this));
        this.canvas.addEventListener('mouseup', penUp(this));
        this.canvas.addEventListener('mousemove', penMove(this));
    }

    render() {
        const ctx = this.canvas.getContext("2d");
        const imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
        const unknownRGB = [236, 66, 245];
        for (let i = 0; i < this.canvas.width * this.canvas.height; i++) {
            const [r, g, b] = Color[this.world[i]] || unknownRGB;
            imageData.data[4 * i + 0] = r;
            imageData.data[4 * i + 1] = g;
            imageData.data[4 * i + 2] = b;
            imageData.data[4 * i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    tick() {
        const W = this.canvas.width;
        const H = this.canvas.height;
        const N = W * H;
        let cell, x, y, j;
        for (let i = N - 1; i >= 0; i--) {
            x = i % W;
            y = (i - x) / W;
            switch (this.world[i]) {
                case Species.Plant:
                    // grow up
                    j = i - W;
                    if (j > 0 && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    // grow up left
                    j = i - W - 1;
                    if (j > 0 && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    // grow up right
                    j = i - W + 1;
                    if (j > 0 && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    // grow left
                    j = i - 1;
                    if (j > 0 && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    // grow right
                    j = i + 1;
                    if (j > 0 && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    // grow down left
                    j = i + W - 1;
                    if (j < N && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    // grow down
                    j = i + W;
                    if (j < N && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    // grow down right
                    j = i + W + 1;
                    if (j < N && this.world[j] === Species.Water) {
                        this.world[j] = Species.Plant;
                        break;
                    }
                    break;
                case Species.Sand:
                    // fall down
                    j = i + W;
                    if (this.world[j] === Species.Empty) {
                        this.world[j] = Species.Sand;
                        this.world[i] = Species.Empty;
                        break;
                    }
                    if (this.world[j] === Species.Water) {
                        this.world[j] = Species.Sand;
                        this.world[i] = Species.Water;
                        break;
                    }
                    if (Math.random() < 0.5) {
                        // fall left
                        if (x > 0) {
                            j = i + W - 1;
                            if (this.world[j] === Species.Empty) {
                                this.world[j] = Species.Sand;
                                this.world[i] = Species.Empty;
                                break;
                            }
                        }
                    } else {
                        // fall right
                        if (x < W) {
                            j = i + W + 1;
                            if (this.world[j] === Species.Empty) {
                                this.world[j] = Species.Sand;
                                this.world[i] = Species.Empty;
                                break;
                            }
                        }
                    }
                    break;
                case Species.Water:
                    // fall down
                    j = i + W;
                    if (this.world[j] === Species.Empty) {
                        this.world[j] = Species.Water;
                        this.world[i] = Species.Empty;
                        break;
                    }
                    if (Math.random() < 0.5) {
                        // fall left
                        if (x > 0) {
                            j = i + W - 1;
                            if (this.world[j] === Species.Empty) {
                                this.world[j] = Species.Water;
                                this.world[i] = Species.Empty;
                                break;
                            }
                        }
                    } else {
                        // fall right
                        if (x < W) {
                            j = i + W + 1;
                            if (this.world[j] === Species.Empty) {
                                this.world[j] = Species.Water;
                                this.world[i] = Species.Empty;
                                break;
                            }
                        }
                    }
                    break;
            }
        }
    }

    draw(x: number, y: number) {
        for (let dx = 0; dx < this.brushSize; dx++) {
            for (let dy = 0; dy < this.brushSize; dy++) {
                const i = (x + dx) + (y + dy) * this.canvas.width;
                this.world[i] = this.brush;
            }
        }
    }

    clear() {
        for (let i = 0; i < this.canvas.width * this.canvas.height; i++) {
            this.world[i] = Species.Empty;
        }
    }

}

const penUp = (game: FallingSandGame) => (event: MouseEvent) => {
    game.drawing = false;
};
const penDown = (game: FallingSandGame) => (event: MouseEvent) => {
    game.drawing = true;
    game.draw(event.offsetX, event.offsetY);
};
const penMove = (game: FallingSandGame) => (event: MouseEvent) => {
    if (game.drawing) {
        const x = event.offsetX;
        const y = event.offsetY;
        game.draw(x, y);
        // dx line
        const dx = Math.abs(event.movementX);
        const sx = Math.sign(event.movementX);
        for (let d = 0; d <= dx; d++) {
            game.draw(x - d * sx, y);
        }
        // dy line
        const dy = Math.abs(event.movementY);
        const sy = Math.sign(event.movementY);
        for (let d = 0; d <= dy; d++) {
            game.draw(x - sx * dx, y - d * sy);
        }
    }
}

enum Species {
    Empty = 0,
    Wall,
    Sand,
    Water,
    Plant,
}

const Color = {
    [Species.Empty]: [0, 0, 0],
    [Species.Wall]: [127, 127, 127],
    [Species.Sand]: [255, 255, 0],
    [Species.Water]: [0, 0, 255],
    [Species.Plant]: [0, 255, 0],
};
