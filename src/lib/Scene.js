/* eslint-disable class-methods-use-this, no-unused-vars, no-empty-function */
export default class Scene {
  initialize() {
    throw Error('Scene must implement initialize method');
  }

  ready() {}

  render() {
    throw Error('Scene must implement render method');
  }

  update() {
    return false;
  }
}
