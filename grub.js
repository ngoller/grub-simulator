// grub.js

import { drawObject } from './utils.js';

export class Grub {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.energyThreshold = 1;
        this.energy = 0;
        this.visionRadius = 50; // Grubs can see food within 50 pixels
        this.color = [0.0, 1.0, 0.0, 1.0]; // Green
        this.velocity = { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 };
        this.maxSpeed = 3;  // Maximum speed grubs can move
    }

    update(plants, grubs, canvas) {
        this.move(plants, canvas);
        this.eat(plants);
        this.reproduce(grubs);
    }

    updateVelocity() {
        // Slightly change the velocity for more natural movement
        this.velocity.x += (Math.random() - 0.5) * 2;
        this.velocity.y += (Math.random() - 0.5) * 2;

        // Limit speed to maxSpeed
        let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }
    }

    move(plants, canvas) {
        let closestFood = this.findFood(plants);
        if (closestFood) {
            this.moveToFood(closestFood);
        } else {
            this.updateVelocity();  // Update velocity for random movement
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
        this.wrapAround(canvas);
    }

    wrapAround(canvas) {
        const width = canvas.width;  // Assuming 'canvas' is accessible globally or passed somehow
        const height = canvas.height;

        if (this.x < 0) {
            this.x += width; // Wrap around to the right side
        } else if (this.x > width) {
            this.x -= width; // Wrap around to the left side
        }

        if (this.y < 0) {
            this.y += height; // Wrap around to the bottom
        } else if (this.y > height) {
            this.y -= height; // Wrap around to the top
        }
    }

    findFood(plants) {
        let minDist = Infinity;
        let nearestPart = null;

        plants.forEach(plant => {
            plant.edibleParts.forEach(part => {
                let dist = Math.hypot(this.x - part.x, this.y - part.y);
                if (dist < this.visionRadius && dist < minDist) {
                    minDist = dist;
                    nearestPart = part;
                }
            });
        });

        return nearestPart;
    }

    moveToFood(food) {
        let angle = Math.atan2(food.y - this.y, food.x - this.x);
        this.x += Math.cos(angle) * this.maxSpeed;
        this.y += Math.sin(angle) * this.maxSpeed;
    }

    eat(plants) {
        plants.forEach(plant => {
            plant.edibleParts = plant.edibleParts.filter(part => {
                let dist = Math.hypot(this.x - part.x, this.y - part.y);
                if (dist < this.size + part.size) {
                    this.energy += 1;
                    return false; // Remove part, grub eats it
                }
                return true;
            });
        });
    }

    reproduce(grubs) {
        if (this.energy >= this.energyThreshold) { // Change as needed for energy threshold
            this.energy = 0; // Consume energy to reproduce
            grubs.push(new Grub(this.x + Math.random() * 20 - 10, this.y + Math.random() * 20 - 10));
        }
    }

    draw(gl, program) {
        drawObject(gl, program, this.x, this.y, this.size, this.color);
    }
}
