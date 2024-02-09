precision mediump float;

uniform sampler2D background;

const vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 blue = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 grey = vec4(0.1, 0.1, 0.1, 1.0);
const vec4 black = vec4(0);
const vec4 white = vec4(1);

uniform float lightSize;
uniform mat3 lights;
uniform mat3 playerLights;
const float attenuation = 1.1;

float aggregateBrightness(mat3 lightSource, float withValue) {
  float brightness;

  for(int i = 0; i < 3; i++) {
    if(lightSource[i].z != withValue) {
      continue;
    }
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
  // if we're blocked by any obstacles, we're in a shadow
  // show gridlines so people can get close
  if(mod(gl_FragCoord.x - 5.0, 100.0) < 10.0
    || mod(gl_FragCoord.y - 5.0, 100.0) < 10.0) {
    color = mix(color, grey, 1.0);
  }

  // border between the two
  if(gl_FragCoord.x > 795.0 && gl_FragCoord.x < 805.0) {
    color = mix(color, white, 1.0);
  }

  float blueBrightness = aggregateBrightness(lights, 0.0);
  float redBrightness = aggregateBrightness(playerLights, 0.0);
  float greenBrightness = aggregateBrightness(playerLights, 1.0);

  color = mix(color, blue, blueBrightness);
  color = mix(color, red, redBrightness);
  color = mix(color, green, greenBrightness);
  color = mix(color, black, 1.0 - (greenBrightness + redBrightness));

  gl_FragColor = color;
}
