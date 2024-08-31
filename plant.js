// plant.js

import { drawObject } from './utils.js';

export class Plant {
    constructor(x, y, parts = 5) {
        this.x = x;
        this.y = y;
        this.size = 10; // Base size of the plant
        this.color = [0.0, 0.5, 0.0, 1.0]; // Dark Green
        this.edibleParts = [];
        this.regenerateRate = 100; // Time in ticks
        this.lastRegenerationTime = 0;

        this.populateInitialParts(parts);
    }

    populateInitialParts(parts) {
        for (let i = 0; i < parts; i++) {
            this.addPart();
        }
    }

    addPart() {
        this.edibleParts.push({
            x: this.x + (Math.random() - 0.5) * this.size * 2,
            y: this.y + (Math.random() - 0.5) * this.size * 2,
            size: Math.random() * 3 + 2, // Small, edible size
        });
    }

    grow() {
        for (let part of this.edibleParts) {
            part.size += 0.05; // Parts grow over time
        }
    }

    update(time) {
        if (time - this.lastRegenerationTime > this.regenerateRate) {
            this.addPart();
            this.lastRegenerationTime = time;
        }
    }

    draw(gl, program) {
        for (let part of this.edibleParts) {
            drawObject(gl, program, part.x, part.y, part.size, this.color);
        }
    }

    removePart(index) {
        this.edibleParts.splice(index, 1);
    }
}
