attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;


// highp -2^16-2^16
// mediump = -2^10-2^10
// lowp -2^8-2^8
precision highp float;
void main(){
  // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position =  projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  vUv = uv;
}

