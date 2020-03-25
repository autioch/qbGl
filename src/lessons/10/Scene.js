import Lib from '../../lib';

const scene = new Lib.Scene('webgl10');

scene.effectiveFPMS = 60 / 1000;
const context = scene.get();
const program = new Lib.Program(context);

program.setShader('shader-vs10');
program.setShader('shader-fs10');
scene.setProgram(program.use());

const textureWall = new Lib.Texture(context, {
  url: 'wall.jpg'
});
const textureFloor = new Lib.Texture(context, {
  url: 'podloga.jpg'
});
const textureCeiling = new Lib.Texture(context, {
  url: 'ceiling.jpg'
});

let pitch = 0;
let pitchRate = 0;

let yaw = 0;
let yawRate = 0;

let xPos = 0;
let yPos = 0.4;
let zPos = 0;

let speed = 0;

let joggingAngle = 0;

const wallsShape = new Lib.Shape(context);
const floorShape = new Lib.Shape(context);
const ceilingShape = new Lib.Shape(context);

const view = new Lib.View('#container10');

view.handleKeyboard = function() {
  const keys = this.currentKeys;

  if (keys[33]) {
    // Page Up
    pitchRate = 0.1;
  } else if (keys[34]) {
    // Page Down
    pitchRate = -0.1;
  } else {
    pitchRate = 0;
  }

  if (keys[37] || keys[65]) {
    // Left cursor key or A
    yawRate = 0.1;
  } else if (keys[39] || keys[68]) {
    // Right cursor key or D
    yawRate = -0.1;
  } else {
    yawRate = 0;
  }

  if (keys[38] || keys[87]) {
    // Up cursor key or W
    speed = 0.003;
  } else if (keys[40] || keys[83]) {
    // Down cursor key
    speed = -0.003;
  } else {
    speed = 0;
  }
};

scene.render = function render() {
  this.mMatrix
    .rotate(-pitch, [1, 0, 0])
    .rotate(-yaw, [0, 1, 0])
    .translate([-xPos, -yPos, -zPos]);

  ceilingShape.getTexture('floor', program.getUniform('uSampler'));
  ceilingShape.getBuffer('textures', program.getAttrib('aTextureCoord'));
  var vertices = ceilingShape.getBuffer('vertices', program.getAttrib('aVertexPosition'));

  this.setMatrixUniforms();
  context.drawArrays(context.TRIANGLES, 0, vertices.count);

  floorShape.getTexture('floor', program.getUniform('uSampler'));
  floorShape.getBuffer('textures', program.getAttrib('aTextureCoord'));
  var vertices = floorShape.getBuffer('vertices', program.getAttrib('aVertexPosition'));

  this.setMatrixUniforms();
  context.drawArrays(context.TRIANGLES, 0, vertices.count);

  wallsShape.getTexture('wall', program.getUniform('uSampler'));
  wallsShape.getBuffer('textures', program.getAttrib('aTextureCoord'));
  var vertices = wallsShape.getBuffer('vertices', program.getAttrib('aVertexPosition'));

  this.setMatrixUniforms();
  context.drawArrays(context.TRIANGLES, 0, vertices.count);
};

scene.update = function update(elapsedTime) {
  if (speed !== 0) {
    xPos -= Math.sin(Lib.degToRad(yaw)) * speed * elapsedTime;
    zPos -= Math.cos(Lib.degToRad(yaw)) * speed * elapsedTime;
    joggingAngle += elapsedTime * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
    yPos = Math.sin(Lib.degToRad(joggingAngle)) / 20 + 0.4;
  }
  yaw += yawRate * elapsedTime;
  pitch += pitchRate * elapsedTime;
  view.handleKeyboard();
};

function handleLoadedWorld(data) {
  const lines = data.split('\n');
  let vertexCount = 0;
  const vertexPositions = [];
  const vertexTextures = [];

  for (const i in lines) {
    const vals = lines[i].replace(/^\s+/, '').split(/\s+/);

    if (vals.length == 5 && vals[0] != '//') {
      // It is a line describing a vertex; get X, Y and Z first
      vertexPositions.push(parseFloat(vals[0]));
      vertexPositions.push(parseFloat(vals[1]));
      vertexPositions.push(parseFloat(vals[2]));

      // And then the texture coords
      vertexTextures.push(parseFloat(vals[3]));
      vertexTextures.push(parseFloat(vals[4]));
      vertexCount += 1;
    }
  }
  wallsShape.setBuffer('vertices', new Float32Array(vertexPositions), context.ARRAY_BUFFER, vertexCount, 3);
  wallsShape.setBuffer('textures', new Float32Array(vertexTextures), context.ARRAY_BUFFER, vertexCount, 2);
  wallsShape.setTexture('wall', textureWall);

  const floorVertices = [
    -3.0, 0.0, -3.0,
    -3.0, 0.0, 3.0,
    3.0, 0.0, 3.0,
    -3.0, 0.0, -3.0,
    3.0, 0.0, -3.0,
    3.0, 0.0, 3.0
  ];
  const floorTextures = [
    0.0, 6.0,
    0.0, 0.0,
    6.0, 0.0,
    0.0, 6.0,
    6.0, 6.0,
    6.0, 0.0
  ];

  floorShape.setBuffer('vertices', new Float32Array(floorVertices), context.ARRAY_BUFFER, 6, 3);
  floorShape.setBuffer('textures', new Float32Array(floorTextures), context.ARRAY_BUFFER, 6, 2);
  floorShape.setTexture('floor', textureFloor);

  const ceilingVertices = [
    -3.0, 1.0, -3.0,
    -3.0, 1.0, 3.0,
    3.0, 1.0, 3.0,
    -3.0, 1.0, -3.0,
    3.0, 1.0, -3.0,
    3.0, 1.0, 3.0
  ];
  const ceilingTextures = [
    0.0, 6.0,
    0.0, 0.0,
    6.0, 0.0,
    0.0, 6.0,
    6.0, 6.0,
    6.0, 0.0
  ];

  ceilingShape.setBuffer('vertices', new Float32Array(ceilingVertices), context.ARRAY_BUFFER, 6, 3);
  ceilingShape.setBuffer('textures', new Float32Array(ceilingTextures), context.ARRAY_BUFFER, 6, 2);
  ceilingShape.setTexture('floor', textureCeiling);

  document.getElementById('loadingtext').textContent = '';
  scene.animate();
}

const request = new XMLHttpRequest();

request.open('GET', 'world.txt');
request.onreadystatechange = function() {
  if (request.readyState == 4) {
    handleLoadedWorld(request.responseText);
  }
};
request.send();
