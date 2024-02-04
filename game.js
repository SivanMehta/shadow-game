const lightSize = 20;
const green = [0, 255, 0];
const red = [255, 0, 0];
const backgroundColour = [0, 100, 100];
const margin = 50;
const height = 400;
const width = 800;

let backgroundBuffer, lightBuffer, finalScreen;
let levels;
let currentLevel = 0;
let playerLights = [];
let gameShader;

function preload() {
  levels = loadJSON('./levels.json');
  gameShader = loadShader('/shaders/game.vert', '/shaders/game.frag');
}

function generateStartingPosition() {
  // start with a random number, in the future it should be
  // far from the other lights
  // far not inside any obstacles
  // not inside the goal
  return {
    x: Math.random() * (400 - margin) + margin / 2,
    y: Math.random() * (400 - margin) + margin / 2
  }
}

function generateBackground() {
  // background
  backgroundBuffer.background(...backgroundColour);
  backgroundBuffer.noStroke();
  // game border
  backgroundBuffer.fill(0);
  backgroundBuffer.rect(395, 0, 10, 400);
}

function setup() {
  // 800 x 400 (double width to make room for each "sub-canvas")
  createCanvas(800, 400);
  for(let i = 0; i < levels[currentLevel].lights.length; i++) {
    playerLights.push(generateStartingPosition());
  }
  // Create both of your off-screen graphics buffers
  backgroundBuffer = createGraphics(width, height);
  lightBuffer = createGraphics(width, height);
  finalScreen = createGraphics(width, height, WEBGL);

  // draw the background and the border
  generateBackground();

  finalScreen.shader(gameShader);
}

function drawLights() {
  // draw background
  // referenceBuffer.background(0, 0, 0);
  
  // draw each light in the level in green
  referenceBuffer.fill(...green);
  referenceBuffer.noStroke();
  for (let i = 0; i < levels[currentLevel].lights.length; i++) {
    let light = levels[currentLevel].lights[i];
    referenceBuffer.ellipse(light.x, light.y, lightSize);
  }
  
  // draw each player light in red
  playerBuffer.fill(...red);
  playerBuffer.noStroke();
  for (let i = 0; i < playerLights.length; i++) {
    let light = playerLights[i];
    playerBuffer.ellipse(light.x, light.y, lightSize);
  }
}

function draw() {
  // Draw on your buffers however you like
  // drawLights();
  gameShader.setUniform("background", backgroundBuffer);

  finalScreen.clear();
  finalScreen.rect(0, 0, width, height);
  // Paint the off-screen buffers onto the main canvas
  image(finalScreen, 0, 0);
}
