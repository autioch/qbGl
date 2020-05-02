export default class Vec4 extends Array {
  constructor(...args) {
    if (args.length !== 4 && args.length !== 0) {
      throw Error('Vec4 should accept 0 or 4 arguments');
    }

    const components = args.length ? args : [0, 0, 0];

    super(...components);
  }

  fillUniform(context, uniformLocation) {
    context.uniform4fv(uniformLocation, this);
  }
}
