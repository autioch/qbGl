import Lib from '../../lib';

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
