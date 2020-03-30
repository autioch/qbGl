import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    attributes: ['pos']
  },
  fsh: {
    source: fsh
  },
  ui: {
    title: 'circle'
  }
};

// https://medium.com/@josecastrovaron/walking-in-circles-9f66aadbf4b4
// https://community.khronos.org/t/circle-in-webgl/62227
// https://observablehq.com/@rreusser/instanced-webgl-circles
// https://stackoverflow.com/questions/58354135/webgl-fastest-approach-to-drawing-many-circles
// https://gamedev.stackexchange.com/questions/55615/how-to-draw-a-circle-with-webgl-using-gl-points
// https://blog.scottlogic.com/2019/10/17/sculpting-shapes-with-webgl-fragment-shader.html
