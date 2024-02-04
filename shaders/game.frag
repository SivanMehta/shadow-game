precision mediump float;

uniform sampler2D background;
varying vec2 pos;

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

void main() {
  // by default everything is the background
  vec4 color = texture2D(background, pos);
  float shadowAmount = 0.0;

  // depending on what side of the border we're on, either ray trace
  // to the player or level lights, with dimming effect depending
  // on the distance to the light
  // if we're blocked by any obstacles, we're in a shadow

  
  gl_FragColor = mix(color, black, shadowAmount);
}
