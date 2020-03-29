import Lib from '../../lib';
import world from './world.txt';
import { floorVertices, floorTextures, ceilingVertices, ceilingTextures } from './consts';
import './wall.jpg';
import './ceiling.jpg';

export default class extends Lib.Scene {
  initialize({ context, el }) {
    this.effectiveFPMS = 60 / 1000;

    this.textureWall = new Lib.Texture(context, {
      url: 'wall.jpg'
    });
    this.textureFloor = new Lib.Texture(context, {
      url: 'podloga.jpg'
    });
    this.textureCeiling = new Lib.Texture(context, {
      url: 'ceiling.jpg'
    });

    this.wallsShape = new Lib.Shape(context);
    this.floorShape = new Lib.Shape(context);
    this.ceilingShape = new Lib.Shape(context);

    this.pitch = 0;
    this.pitchRate = 0;
    this.yaw = 0;
    this.yawRate = 0;
    this.xPos = 0;
    this.yPos = 0.4;
    this.zPos = 0;
    this.speed = 0;
    this.joggingAngle = 0;

    this.keyboard = Lib.keyboard({
      selector: el
    });

    this.loadWorld(context);
  }

  render({ context, program, mMatrix, setMatrixUniforms }) {
    mMatrix
      .rotate(-this.pitch, [1, 0, 0])
      .rotate(-this.yaw, [0, 1, 0])
      .translate([-this.xPos, -this.yPos, -this.zPos]);

    this.ceilingShape.getTexture('floor', program.getUniform('uSampler'));
    this.ceilingShape.getBuffer('textures', program.getAttrib('aTextureCoord'));

    const ceilVerticesBuffer = this.ceilingShape.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, ceilVerticesBuffer.count);

    this.floorShape.getTexture('floor', program.getUniform('uSampler'));
    this.floorShape.getBuffer('textures', program.getAttrib('aTextureCoord'));

    const floorVerticesBuffer = this.floorShape.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, floorVerticesBuffer.count);

    this.wallsShape.getTexture('wall', program.getUniform('uSampler'));
    this.wallsShape.getBuffer('textures', program.getAttrib('aTextureCoord'));

    const wallVerticesBuffer = this.wallsShape.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, wallVerticesBuffer.count);
  }

  update(timeSinceLastUpdate) {
    if (this.speed !== 0) {
      this.xPos -= Math.sin(Lib.degToRad(this.yaw)) * this.speed * timeSinceLastUpdate;
      this.zPos -= Math.cos(Lib.degToRad(this.yaw)) * this.speed * timeSinceLastUpdate;
      this.joggingAngle += timeSinceLastUpdate * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
      this.yPos = (Math.sin(Lib.degToRad(this.joggingAngle)) / 20) + 0.4;
    }
    this.yaw += this.yawRate * timeSinceLastUpdate;
    this.pitch += this.pitchRate * timeSinceLastUpdate;
    this.handleKeys();
  }

  handleKeys() {
    const keys = this.keyboard;

    if (keys[33]) {
      // Page Up
      this.pitchRate = 0.1;
    } else if (keys[34]) {
      // Page Down
      this.pitchRate = -0.1;
    } else {
      this.pitchRate = 0;
    }

    if (keys[37] || keys[65]) {
      // Left cursor key or A
      this.yawRate = 0.1;
    } else if (keys[39] || keys[68]) {
      // Right cursor key or D
      this.yawRate = -0.1;
    } else {
      this.yawRate = 0;
    }

    if (keys[38] || keys[87]) {
      // Up cursor key or W
      this.speed = 0.003;
    } else if (keys[40] || keys[83]) {
      // Down cursor key
      this.speed = -0.003;
    } else {
      this.speed = 0;
    }
  }

  loadWorld(context) {
    const lines = world.split('\n');
    let vertexCount = 0;
    const vertexPositions = [];
    const vertexTextures = [];

    for (const i in lines) {
      const vals = lines[i].replace(/^\s+/, '').split(/\s+/);

      if (vals.length === 5 && vals[0] !== '//') {
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
    this.wallsShape.setBuffer('vertices', new Float32Array(vertexPositions), context.ARRAY_BUFFER, vertexCount, 3);
    this.wallsShape.setBuffer('textures', new Float32Array(vertexTextures), context.ARRAY_BUFFER, vertexCount, 2);
    this.wallsShape.setTexture('wall', this.textureWall);

    this.floorShape.setBuffer('vertices', new Float32Array(floorVertices), context.ARRAY_BUFFER, 6, 3);
    this.floorShape.setBuffer('textures', new Float32Array(floorTextures), context.ARRAY_BUFFER, 6, 2);
    this.floorShape.setTexture('floor', this.textureFloor);

    this.ceilingShape.setBuffer('vertices', new Float32Array(ceilingVertices), context.ARRAY_BUFFER, 6, 3);
    this.ceilingShape.setBuffer('textures', new Float32Array(ceilingTextures), context.ARRAY_BUFFER, 6, 2);
    this.ceilingShape.setTexture('floor', this.textureCeiling);
  }
}
