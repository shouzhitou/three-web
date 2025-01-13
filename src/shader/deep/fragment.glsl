precision highp float;
uniform float uTime;

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main(){
    // float x = mod(vUv.x * 10.0, 1.0);
    // gl_FragColor = vec4(x, x, x, 1);
    // gl_FragColor = vec4(1.0-x, 1.0-x, 1.0-x, 1);
    // float f = step(0.2,  mod(vUv.x * 10.0, 1.0));
    // f *= step(0.2,  mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(f, f, f, 1);

    // float barX = step(0.2,  mod(vUv.x * 10.0, 1.0)) * step(0.2,  mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.2,  mod(vUv.y * 10.0, 1.0)) * step(0.2,  mod(vUv.x * 10.0, 1.0));
    // float f = barX + barY;
    // gl_FragColor = vec4(vUv, 1, f);


    // float f = abs(vUv.x - 0.5) * 2.0;
    // gl_FragColor = vec4(f, f, f, 1);

    // float f = min(abs(vUv.x - 0.5) * 2.0, abs(vUv.y - 0.5) * 2.0);
    // float f = 1.0 - max(abs(vUv.x - 0.5) * 2.0, abs(vUv.y - 0.5) * 2.0);

    // float f = floor(vUv.x * 10.0) / 10.0;


    // float f1= floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    // float f = random(vec2(f1, f1));
    // float f = length(vUv);
    // float f = 1.0 - distance(vUv, vec2(0.5, 0.5));
    // float f = 0.15 / distance(vec2(vUv.x,(vUv.y-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
    // f  += 0.15 / distance(vec2(vUv.y,(vUv.x-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
    // gl_FragColor = vec4(f, f, f, 1);

    // vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5));
    // vec2 rotateUv = rotate(vUv,-uTime*5.0,vec2(0.5));
    // float  strength = 0.15 / distance(vec2(rotateUv.x,(rotateUv.y-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
    // strength += 0.15 / distance(vec2(rotateUv.y,(rotateUv.x-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
    // gl_FragColor =vec4(strength,strength,strength,strength);

    // float f = step(0.5,distance(vUv, vec2(0.5)) + 0.25);
    // f *= (1.0 - step(0.5,distance(vUv, vec2(0.5)) + 0.15));

    // vec2 waveUv = vec2(
    //   vUv.x + sin(vUv.y * 100.0) * 0.1,
    //   vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float f =1.0- step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    // gl_FragColor =vec4(f, f, f,1.0);

    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    float f = (angle + 3.14) / 6.28;
    gl_FragColor =vec4(f, f, f,1.0);
}


