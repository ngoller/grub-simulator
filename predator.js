// predator.js
import { drawObject } from './utils.js';

export class Predator {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.color = [1.0, 0.0, 0.0, 1.0]; // Red
        this.energy = 0;
        this.velocity = { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 };
        this.reproductionThreshold = 15; // Energy needed to reproduce
        this.minSeparation = 20; // Minimum distance from other predators
        this.energyLossPerTick = 1; // Energy lost per update cycle
        this.starvationThreshold = -500; // Threshold below which the predator starves
    }

    updateEnergy() {
        this.energy -= this.energyLossPerTick;
        if (this.energy <= this.starvationThreshold) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
    }

    // return any predators created by hunting
    hunt(grubs, canvas) {
        let nearestGrub = null;
        let minDist = Infinity;
        for (let grub of grubs) {
            let dist = (this.x - grub.x) ** 2 + (this.y - grub.y) ** 2;
            if (dist < minDist) {
                minDist = dist;
                nearestGrub = grub;
            }
        }

        if (nearestGrub) {
            // Calculate direction vector towards the grub
            let directionX = nearestGrub.x - this.x;
            let directionY = nearestGrub.y - this.y;
            let distance = Math.sqrt(directionX * directionX + directionY * directionY);

            // Normalize direction vector
            directionX /= distance;
            directionY /= distance;

            // Update velocity towards the grub
            this.velocity.x += directionX * 0.1; // Adjust acceleration factor as needed
            this.velocity.y += directionY * 0.1;

            // Ensure velocity stays within reasonable limits
            let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            const maxSpeed = 2;
            if (speed > maxSpeed) {
                this.velocity.x = (this.velocity.x / speed) * maxSpeed;
                this.velocity.y = (this.velocity.y / speed) * maxSpeed;
            }

            // Eat the grub if close enough
            if (minDist < this.size) {
                this.energy = Math.max(this.energy, 0);
                this.energy += 10;  // Increase energy
                grubs.splice(grubs.indexOf(nearestGrub), 1); // Remove the grub from the array
            }
        }

        this.wrapAround(canvas);

        // Check if enough energy to reproduce and return new predator if so
        if (this.energy >= this.reproductionThreshold) {
            return this.reproduce();
        }
    }

    // Implement separation logic
    separate(predators) {
        let moveX = 0, moveY = 0, count = 0;
        predators.forEach(predator => {
            let distance = Math.hypot(predator.x - this.x, predator.y - this.y);
            if (distance > 0 && distance < this.minSeparation) {
                moveX += (this.x - predator.x) / distance;  // Normalize and invert direction
                moveY += (this.y - predator.y) / distance;  // Normalize and invert direction
                count++;
            }
        });

        if (count > 0) {
            this.velocity.x += moveX / count;
            this.velocity.y += moveY / count;
        }
    }

    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Ensure velocity stays within reasonable limits
        let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const maxSpeed = 2;
        if (speed > maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * maxSpeed;
        }
    }

    // Method for reproduction
    reproduce() {
        // Reset energy after reproduction
        this.energy -= this.reproductionThreshold;

        // Create a new predator at nearby location
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        return new Predator(this.x + offsetX, this.y + offsetY);
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

    draw(gl, program) {
        drawObject(gl, program, this.x, this.y, this.size, this.color);
    }
}
