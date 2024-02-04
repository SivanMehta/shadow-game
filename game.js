const lightSize = 20;
const green = [0, 255, 0];
const red = [255, 0, 0];
const margin = 50;

var referenceBuffer;
var playerBuffer;
let levels;
let currentLevel = 0;
let playerLights = [];

function preload() {
  levels = loadJSON('./levels.json');
}

function generateRandomLight() {
  return {
    x: Math.random() * (400 - margin) + margin/2,
    y: Math.random() * (400 - margin) + margin/2
  }
}

function setup() {
  // 800 x 400 (double width to make room for each "sub-canvas")
  createCanvas(800, 400);
  for(let i = 0; i < levels[currentLevel].lights.length; i++) {
    playerLights.push(generateRandomLight());
  }
  // Create both of your off-screen graphics buffers
  referenceBuffer = createGraphics(400, 400);
  playerBuffer = createGraphics(400, 400);

  // draw the background and the border
  fill("#62A6A9");
  rect(0, 0, 800, 400);
  fill(0, 0, 0);
  rect(400, 0, 10, 400);

}

function draw() {
  // Draw on your buffers however you like
  drawReferenceBuffer();
  drawPlayerBuffer();

  // Paint the off-screen buffers onto the main canvas
  image(referenceBuffer, 0, 0);
  image(playerBuffer, 400, 0);

}

function drawReferenceBuffer() {
  // draw background
  // referenceBuffer.background(0, 0, 0);
  
  // draw each light in the level in green
  referenceBuffer.fill(...green);
  referenceBuffer.noStroke();
  for (let i = 0; i < levels[currentLevel].lights.length; i++) {
    let light = levels[currentLevel].lights[i];
    referenceBuffer.ellipse(light.x, light.y, lightSize);
  }
}

function drawPlayerBuffer() {
  // playerBuffer.background(255, 100, 255);
  
  // draw each light in the level in white, expect
  playerBuffer.fill(...red);
  playerBuffer.noStroke();
  for (let i = 0; i < playerLights.length; i++) {
    let light = playerLights[i];
    playerBuffer.ellipse(light.x, light.y, lightSize);
  }
}
