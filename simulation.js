// simulation.js

import { Grub } from './grub.js';
import { Plant } from './plant.js';
import { Predator } from './predator.js';
import { drawObject } from './utils.js'; // Import drawObject


let speedFactor = 1;  // This gets changed by the speed-up widget

document.addEventListener('DOMContentLoaded', () => {
    const speedControl = document.getElementById('speedControl');
    speedControl.addEventListener('input', function () {
        updateSpeedFactor(this.value);
    });
});

function updateSpeedFactor(value) {
    speedFactor = parseInt(value);
    // Update simulation speed or any other logic you need
    displayCurrentSpeed(speedFactor);
}

function displayCurrentSpeed(speed) {
    const speedDisplay = document.getElementById('speedDisplay');
    speedDisplay.textContent = `Current Speed: ${speed}x`;
}

const canvas = document.getElementById('simulationCanvas');
const gl = canvas.getContext('webgl');

let time = 0; // tracks updates

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (!gl) {
    alert("WebGL isn't supported by your browser.");
}

// Set the viewport and clear color
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Initialize shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(shaderProgram);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

const grubs = [];
const plants = [];
const predators = [];

for (let i = 0; i < 50; i++) {
    grubs.push(new Grub(Math.random() * canvas.width, Math.random() * canvas.height));
}

for (let i = 0; i < 100; i++) {
    plants.push(new Plant(Math.random() * canvas.width, Math.random() * canvas.height, Math.floor(Math.random() * 10) + 5));
}

for (let i = 0; i < 5; i++) {
    predators.push(new Predator(Math.random() * canvas.width, Math.random() * canvas.height));
}

function updateSimulation() {
    for (let i = 0; i < speedFactor; i++) {
        update(); // This function advances your simulation by one tick
    }
}

function update() {
    time++;
    for (let grub of grubs) {
        grub.update(plants, grubs, canvas);
    }

    for (let i = predators.length - 1; i >= 0; i--) {
        const predator = predators[i];
        const newPredator = predator.hunt(grubs, canvas);
        if (newPredator) {
            predators.push(newPredator);
        }
        predator.separate(predators);
        predator.move();
        predator.updateEnergy();

        if (predators[i].isDead) {  // Assuming you set isDead when energy reaches 0
            predators.splice(i, 1);  // Remove dead predator from the array
        }
    }

    for (let plant of plants) {
        plant.update(time);
    }
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let plant of plants) {
        plant.draw(gl, shaderProgram);
    }

    for (let grub of grubs) {
        grub.draw(gl, shaderProgram);
    }

    for (let predator of predators) {
        predator.draw(gl, shaderProgram);
    }

    updateHtml();
}

function updateHtml() {
    document.getElementById('time').textContent = `Time elapsed: ${time}`;
    document.getElementById('population').textContent = `Grubs: ${grubs.length}, Predators ${predators.length}, Plants: ${plants.length}`;
}

function loop() {
    updateSimulation();
    drawScene();
    requestAnimationFrame(loop);
}

loop();