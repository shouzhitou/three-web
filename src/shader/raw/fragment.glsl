precision highp float;
uniform vec3 uColor;
varying float vElevation;
precision highp float;
varying vec2 vUv;

uniform sampler2D uTexture;

void main(){
    float alpha = (vElevation + 0.1) + 0.8;
    // gl_FragColor = vec4(uColor,alpha);
    // gl_FragColor = vec4(uColor*alpha,1);
    // gl_FragColor= vec4(vUv,0,1);

    vec4 textureColor = texture2D(uTexture, vUv);
    // vec4 textureColor = vec4(uColor, 1);
    textureColor.rgb *= alpha;
    gl_FragColor = textureColor;
}