const lightSize = 25;
const green = [0, 255, 0];
const red = [255, 0, 0];
const backgroundColour = [0, 50, 50];
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
  return [
    800 + Math.random() * (800 - lightSize * 2),
    Math.random() * (800 - lightSize * 2),
    0
  ]
}

function generateBackground() {
  // background
  backgroundBuffer.background(...backgroundColour);
  backgroundBuffer.noStroke();
  // game border
  backgroundBuffer.fill(0);
  backgroundBuffer.rect(395, 0, 10, 400);
}

function lightsAsMatrix(lights) {
  const matrix = [];
  for (let i = 0; i < lights.length; i++) {
    matrix.push(
      lights[i].x, lights[i].y, 0.0
    );
  }
  return matrix;
}

function setup() {
  createCanvas(window.innerHeight, window.innerWidth);
  for(let i = 0; i < levels[currentLevel].lights.length; i++) {
    playerLights.push(...generateStartingPosition());
  }
  // Create both of your off-screen graphics buffers
  backgroundBuffer = createGraphics(width, height);
  lightBuffer = createGraphics(width, height);
  finalScreen = createGraphics(width, height, WEBGL);

  // draw the background and the border
  generateBackground();

  finalScreen.shader(gameShader);

  const lightMatrix = lightsAsMatrix(levels[currentLevel].lights);
  gameShader.setUniform("lights", lightMatrix);
  gameShader.setUniform("playerLights", playerLights)
  gameShader.setUniform("lightSize", lightSize);

  console.log(lightMatrix, playerLights)
}

function draw() {
  // Draw on your buffers however you like
  gameShader.setUniform("background", backgroundBuffer);

  finalScreen.clear();
  finalScreen.rect(0, 0, width, height);
  // Paint the off-screen buffers onto the main canvas
  image(finalScreen, 0, 0);
}
