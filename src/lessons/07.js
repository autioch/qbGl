import qbGl from '../libs/qbGl';
(function(qb) {
  const cubeDef = {
    vertices: [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0
    ],
    translate: [0.0, 0.0, -5.0],
    itemSize: 3,
    numItems: 24,
    type: 'Cube',
    draw: 'TRIANGLES',
    drawType: 'UNSIGNED_SHORT',
    rotateSpeed: 150,
    rotateVertex: [1, 1, 1],
    rotateDirection: 1,
    colors: [
      [1.0, 0.0, 0.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [0.5, 1.0, 1.0, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 0.0, 1.0, 1.0] // Left face
    ],
    indices: [
      0, 1, 2, 0, 2, 3, // Front face
      4, 5, 6, 4, 6, 7, // Back face
      8, 9, 10, 8, 10, 11, // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23 // Left face
    ],
    textures: [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0
    ],
    normals: [
      // Front face
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,

      // Back face
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,

      // Top face
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,

      // Bottom face
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,

      // Right face
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,

      // Left face
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0
    ]
  };

  const scene = new qb.Scene('webgl07');
  const context = scene.get();
  const program = new qb.Program(context);
  const light = new qb.Light(context);

  program.setShader('shader-vs07');
  program.setShader('shader-fs07');

  scene.setProgram(program.use());

  const texturesLoaded = function() {
    this.loaded = true;
    for (let i = 0; i < textures.length; i++) {
      if (!textures[i].loaded) {
        return;
      }
    }
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    textures[0].bind(context.NEAREST, context.NEAREST);
    textures[1].bind(context.LINEAR, context.LINEAR);
    textures[2].bind(context.LINEAR, context.LINEAR_MIPMAP_NEAREST);
    context.generateMipmap(context.TEXTURE_2D);
    context.bindTexture(context.TEXTURE_2D, null);
  };

  var textures = [
    new qb.Texture(context, {
      url: 'podloga.jpg',
      onload: texturesLoaded
    }),
    new qb.Texture(context, {
      url: 'podloga.jpg',
      onload: texturesLoaded
    }),
    new qb.Texture(context, {
      url: 'podloga.jpg',
      onload: texturesLoaded
    })
  ];

  const cube = new qb.Shape(context);

  cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), context.ARRAY_BUFFER, 24, 3);
  cube.setBuffer('normals', new Float32Array(cubeDef.normals), context.ARRAY_BUFFER, 24, 3);
  cube.setBuffer('textures', new Float32Array(cubeDef.textures), context.ARRAY_BUFFER, 24, 2);
  cube.setBuffer('indices', new Uint16Array(cubeDef.indices), context.ELEMENT_ARRAY_BUFFER, 36, 1);
  cube.setTexture('0', textures[0]);
  cube.setTexture('1', textures[1]);
  cube.setTexture('2', textures[2]);
  cube.xRot = 0;
  cube.xSpeed = 0;
  cube.yRot = 0;
  cube.ySpeed = 0;
  cube.z = -5.0;
  cube.filter = 0;

  scene.render = function(context, modelViewMatrix, program) {
    modelViewMatrix
      .translate([0.0, 0.0, cube.z])
      .rotate(cube.xRot, [1, 0, 0])
      .rotate(cube.yRot, [0, 1, 0]);

    cube.getBuffer('vertices', program.getAttrib('aVertexPosition'));
    cube.getBuffer('normals', program.getAttrib('aVertexNormal'));
    cube.getBuffer('textures', program.getAttrib('aTextureCoord'));
    cube.getTexture(cube.filter, program.getUniform('uSampler'));

    const lighting = document.getElementById('lighting').checked;

    context.uniform1i(program.getUniform('uUseLighting'), lighting);
    if (lighting) {
      light.get3f(program.getUniform('uAmbientColor'), getVal('ambientR'), getVal('ambientG'), getVal('ambientB'));
      light.get3fv(program.getUniform('uLightingDirection'), getVal('lightDirectionX'), getVal('lightDirectionY'), getVal('lightDirectionZ'));
      light.get3f(program.getUniform('uDirectionalColor'), getVal('directionalR'), getVal('directionalG'), getVal('directionalB'));
    }

    const indices = cube.getBuff('indices');

    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indices);
    this.setMatrixUniforms();
    context.uniformMatrix3fv(program.getUniform('uNMatrix'), false, modelViewMatrix.toInvTraMat3());

    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);
  };

  scene.update = function(timeSinceLastUpdate) {
    cube.xRot += (cube.xSpeed * timeSinceLastUpdate) / 1000.0;
    cube.yRot += (cube.ySpeed * timeSinceLastUpdate) / 1000.0;
    handleKeys();
  };

  scene.animate();

  const container = document.getElementById('container07');

  container.onkeydown = handleKeyDown;
  container.onkeyup = handleKeyUp;

  const currentlyPressedKeys = {};

  function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;

    if (String.fromCharCode(event.keyCode) == 'F') {
      cube.filter += 1;
      if (cube.filter == 3) {
        cube.filter = 0;
      }
      document.getElementById('tooltip07').textContent = `Filter: ${cube.filter}`;
    }
  }

  function getVal(id) {
    return parseFloat(document.getElementById(id).value);
  }

  function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
  }

  function handleKeys() {
    if (currentlyPressedKeys[33]) {
      // Page Up
      cube.z -= 0.05;
    }
    if (currentlyPressedKeys[34]) {
      // Page Down
      cube.z += 0.05;
    }
    if (currentlyPressedKeys[37]) {
      // Left cursor key
      cube.ySpeed -= 1;
    }
    if (currentlyPressedKeys[39]) {
      // Right cursor key
      cube.ySpeed += 1;
    }
    if (currentlyPressedKeys[38]) {
      // Up cursor key
      cube.xSpeed -= 1;
    }
    if (currentlyPressedKeys[40]) {
      // Down cursor key
      cube.xSpeed += 1;
    }
  }
})(qbGl);
