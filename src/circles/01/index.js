import fsh from './main.fsh';
import vsh from './main.vsh';

function radian(degree) {
  return degree * (Math.PI / 180);
}

function shaderProgram(gl, vs, fs) {
  const prog = gl.createProgram();

  function addshader(type, source) {
    const s = gl.createShader(type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw `Could not compile ${type} shader:\n\n${gl.getShaderInfoLog(s)}`;
    }
    gl.attachShader(prog, s);
  }

  addshader('vertex', vs);
  addshader('fragment', fs);

  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw 'Could not link the shader program!';
  }

  return prog;
}

function attributeSetFloats(gl, prog, attr_name, rsize, arr) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

  const attr = gl.getAttribLocation(prog, attr_name);

  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, rsize, gl.FLOAT, false, 0, 0);
}

function draw(el) { // eslint-disable-line max-statements
  const gl = el.getContext('experimental-webgl');

  gl.clearColor(0.8, 0.8, 0.8, 1); // background
  gl.clear(gl.COLOR_BUFFER_BIT);

  const prog = shaderProgram(gl, vsh, fsh);

  gl.useProgram(prog);

  const arrayradian = [];
  const rotationradian = [];

  for (let i = 0; i <= 360; i += 0.1) { // 1, 5, 15 number of line draw
    arrayradian.push(radian(i));
    rotationradian.push(Math.cos(radian(i)), Math.sin(radian(i)), 0);
  }

  attributeSetFloats(gl, prog, 'pos', 3, rotationradian);
  gl.drawArrays(gl.LINES, 0, rotationradian.length / 3);
}

export default class Circle01 {
  constructor(width, height) {
    this.el = document.createElement('canvas');
    this.el.width = width;
    this.el.height = height;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.containerEl = document.createElement('div');
    this.containerEl.classList.add('container');
    this.containerEl.setAttribute('tabindex', 0);

    this.containerEl.append(this.el);
    document.body.append(this.containerEl);

    draw(this.el);
  }
}
