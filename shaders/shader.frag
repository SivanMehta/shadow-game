precision mediump float;

uniform sampler2D colour;
uniform sampler2D height;

uniform vec3 sunPos;
varying vec2 pos;
const float maxBrightness = 0.5;
const float STEPS = 100.0;

void main() {
  // Get height from height map
  float hgt = texture2D(height, pos).r;
  
  // Starting point for ray cast
  vec3 p = vec3(pos, hgt);
  // Direction of raycast is towards the sun
  vec3 stepDir = (sunPos - p)/STEPS;
  
  float inShadow = 0.;
  float stepsTaken = 0.0;
  for(float i = 0.; i < STEPS; i ++) {
    // Step towards the sun
    p += stepDir;
    stepsTaken += 1.0;
    
    // Check height at new location
    float h = texture2D(height, p.xy).r;
    if(h > p.z) {
      // ray is inside the terrain
      // therefore must be in shadow
      inShadow = 1.;
      break;
    }
    if(p.z > 1.) {
      // above the heighest terrain level
      // will not be in shadow
      break;
    }
  }

  
  vec4 col = texture2D(colour, pos);
  // create a darker version of the colour for the shadows
  float shadowProgression = ((STEPS - stepsTaken) / STEPS);
  float a = 8.7;
  float b = 0.15;
  float shadowBrightness = pow(a, -shadowProgression)/(a * b) + 0.5;
  vec4 shadowCol = vec4(col.rgb * shadowBrightness, col.a);
  
  gl_FragColor = mix(col, shadowCol, inShadow);
  
}
