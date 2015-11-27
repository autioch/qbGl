function extend(protoProps) {
  var parent = this;
  var child, prop;

  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function() {
      return parent.apply(this, arguments);
    };
  }

  var Surrogate = function() {
    this.constructor = child;
  };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  for (prop in protoProps) {
    child.prototype[prop] = protoProps[prop];
  }

  return child;
}
