uniform float v[10];

const background = vec4(0.243, 0.651, 0.663, 1.0);

void main() {
  // if we're too far from any point, just use the background color
  // if we're inside a correct level, color it white
  // if we're inside a player, color it red
  // if the player is actually right, color it green
  // if we're inside the border, color it back
  gl_FragColor = background;
}
