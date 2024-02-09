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
let canvas;

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

const interaction = {
  mouseDown: false,
  holdingLight: NaN,
  entry: []
};

function mouseDown() {
  interaction.mouseDown = true;
  attemptToCaptureLight();
}

function mouseUp() {
  interaction.mouseDown = false;
  interaction.entry = [];
  interaction.holdingLight = NaN;
}

function distance(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)
  );
}

function attemptToCaptureLight() {
  for(let i = 0; i < playerLights.length; i += 3) {
    const light = [playerLights[i], playerLights[i + 1]];
    const distanceToLight = distance([mouseX * 2, mouseY * 2], light);

    if(distanceToLight < lightSize) {
      interaction.holdingLight = i;
      break;
    }
  }
}

function closeToGoal() {
  const heldLight = [
    playerLights[interaction.holdingLight],
    playerLights[interaction.holdingLight + 1]
  ];

  for (let i = 0; i < levels[currentLevel].lights.length; i++) {
    const tolerance = lightSize;
    const goalLight = levels[currentLevel].lights[i];
    const goalCoords = [
      800 + goalLight.x,
      goalLight.y
    ]
    const distanceToGoal = distance(goalCoords, heldLight);

    if(distanceToGoal < tolerance) {
      return true;
    }
  }
}

function moveLight() {
  if(isNaN(interaction.holdingLight)) {
    return;
  }

  playerLights[interaction.holdingLight] = mouseX * 2;
  playerLights[interaction.holdingLight + 1] = mouseY * 2;

  if(closeToGoal()) {
    playerLights[interaction.holdingLight + 2] = 1;
  } else {
    playerLights[interaction.holdingLight + 2] = 0;
  }
  
  rerender();
}

function mouseMoved() {
  // see if we can capture a light
  if(interaction.mouseDown) {
    moveLight();
  }
}

function setup() {
  canvas = createCanvas(window.innerHeight, window.innerWidth);
  canvas.mousePressed(mouseDown);
  canvas.mouseReleased(mouseUp);
  canvas.mouseMoved(mouseMoved);
  
  for(let i = 0; i < levels[currentLevel].lights.length; i++) {
    playerLights.push(...generateStartingPosition());
  }
  // Create both of your off-screen graphics buffers
  backgroundBuffer = createGraphics(width, height);
  lightBuffer = createGraphics(width, height);
  finalScreen = createGraphics(width, height, WEBGL);

  // Draw on your buffers however you like
  gameShader.setUniform("background", backgroundBuffer);
  // draw the background and the border
  generateBackground();

  finalScreen.shader(gameShader);

  const lightMatrix = lightsAsMatrix(levels[currentLevel].lights);
  gameShader.setUniform("lights", lightMatrix);
  gameShader.setUniform("playerLights", playerLights);
  gameShader.setUniform("lightSize", lightSize);
}

function rerender() {
  gameShader.setUniform("playerLights", playerLights);
}

function draw() {
  finalScreen.clear();
  finalScreen.rect(0, 0, width, height);
  // Paint the off-screen buffers onto the main canvas
  image(finalScreen, 0, 0);
}
