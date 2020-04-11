/* eslint-disable class-methods-use-this, no-unused-vars, no-empty-function */
export default class Scene {
  initialize({ context }) {
    throw Error('Scene must implement initialize method');
  }

  ready({ context }) {}

  render({ context, attributes, uniforms, mMatrix, setMatrixUniforms }) {
    throw Error('Scene must implement render method');
  }

  update() {
    return false;
  }
}
