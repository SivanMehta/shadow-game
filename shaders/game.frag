precision mediump float;

uniform sampler2D background;

const vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 black = vec4(0);
uniform float lightSize;
uniform mat3 lights;
uniform mat3 playerLights;
const float attenuation = 1.1;

float aggregateBrightness(mat3 lightSource) {
  float brightness;

  for(int i = 0; i < 3; i++) {
    vec2 light = vec2(lightSource[i].x, 800.0 - lightSource[i].y);

    float lightDistance = distance(gl_FragCoord.xy, light);
    if(lightDistance < lightSize) {
      brightness = 1.0;
    } else {
      brightness += lightSize / pow(lightDistance, attenuation);
    }
  }

  return brightness;
}

void main() {
  // by default everything is the background
  vec4 color = texture2D(background, gl_FragCoord.xy / 2.0);

  // depending on what side of the border we're on, either ray trace
  // to the player or level lights, with dimming effect depending
  // on the distance to the light

  // will ideally be a uniform
  float greenBrightness = aggregateBrightness(lights);
  float redBrightness = aggregateBrightness(playerLights);

  // if we're blocked by any obstacles, we're in a shadow
  color = mix(color, green, greenBrightness);
  color = mix(color, red, redBrightness);
  color = mix(color, black, 1.0 - (greenBrightness + redBrightness));

  gl_FragColor = color;
}
