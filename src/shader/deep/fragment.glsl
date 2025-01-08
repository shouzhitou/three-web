precision highp float;

varying vec2 vUv;

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


    float f = abs(vUv.x - 0.5) * 2.0;
    gl_FragColor = vec4(f, f, f, 1);
}