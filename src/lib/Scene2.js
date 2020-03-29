/* eslint-disable class-methods-use-this, no-unused-vars, no-empty-function */
export default class Scene2 {
  initialize({ context }) {
    throw Error('Scene must implement initialize method');
  }

  render({ context, program, mMatrix, pMatrix, setMatrixUniforms }) {
    throw Error('Scene must implement render method');
  }

  update() {}
}
