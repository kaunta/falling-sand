class FallingSandGame {
    readonly canvas: HTMLCanvasElement;
    readonly world: Uint8Array;
    drawing: boolean = false;
    brush: Species = Species.Wall;


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

const penUp = (game: FallingSandGame) => (event: MouseEvent) => {
    game.drawing = false;
};
const penDown = (game: FallingSandGame) => (event: MouseEvent) => {
    game.drawing = true;
    const i = event.offsetX + event.offsetY * game.canvas.width;
    game.world[i] = game.brush;
};
const penMove = (game: FallingSandGame) => (event: MouseEvent) => {
    if (game.drawing) {
        const i = event.offsetX + event.offsetY * game.canvas.width;
        game.world[i] = game.brush;
        // dx line
        const dx = Math.abs(event.movementX);
        const sx = Math.sign(event.movementX);
        for (let d = 0; d <= dx; d++) {
            game.world[i - sx * d] = game.brush;
        }
        // dy line
        const dy = Math.abs(event.movementY);
        const sy = Math.sign(event.movementY);
        for (let d = 0; d <= dy; d++) {
            game.world[i - sx * dx - game.canvas.width * sy * d] = game.brush;
        }
    }
}

enum Species {
    Empty = 0,
    Wall,
}

const Color = {
    [Species.Empty]: [0, 0, 0],
    [Species.Wall]: [255, 255, 0],
};
