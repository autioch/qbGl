function Program(context, fragmentId, vertexId) {
  var program = context.createProgram();

  var attribs = {};
  var uniforms = {};

  var fragmentShader = getShaderFromScript(context, fragmentId, attribs, uniforms);
  var vertexShader = getShaderFromScript(context, vertexId, attribs, uniforms);

  context.attachShader(program, fragmentShader.code);
  context.attachShader(program, vertexShader.code);

  function compileShader(context, shaderSource, shaderType) {
    var shader = context.createShader(shaderType);
    context.shaderSource(shader, shaderSource.textContent);
    context.compileShader(shader);
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      throw 'Shader compile error. ' + context.getShaderInfoLog(shader);
    }
    return shader;
  }

  function getDataFromScript(script, type, cache) {
    var result = [];
    var data = script.getAttribute('data-' + type);
    if (data && data.length) {
      data.split(',').forEach(function(attribName) {
        if (cache[attribName]) {
          throw 'Attrib already defined. ' + attribName;
        }
        cache[attribName] = {};
      });
    }
    return result;
  }

  function getShaderFromScript(context, scriptSelector, attribs, uniforms) {
    var type;
    var script = document.querySelector(scriptSelector);
    if (!script) {
      throw 'Shader script not found. ' + scriptSelector;
    }
    if (script.type == 'x-shader/x-vertex') {
      type = context.VERTEX_SHADER;
    } else if (script.type == 'x-shader/x-fragment') {
      type = context.FRAGMENT_SHADER;
    } else {
      throw 'Shader type not set. ' + scriptSelector;
    }
    return {
      code: compileShader(context, script.textContent, type),
      uniforms: getDataFromScript(script, 'uniforms', uniforms),
      attribs: getDataFromScript(script, 'attribs', attribs)
    };
  }

  function getAttributeLocation(name) {
    var location = context.getAttribLocation(program, name);
    if (location === undefined) {
      throw 'No location for attribute. ' + name;
    }
    return location;
  }

  function getUniformLocation(name) {
    var location = context.getUniformLocation(program, name);
    if (location === undefined) {
      throw 'No location for uniform. ' + name;
    }
    return location;
  }

  function uniform(name) {
    var location = uniforms[name];
    if (location === undefined) {
      throw 'Undefined uniform: ' + name;
    }
    return location;
  }

  function attrib(name) {
    var location = attribs[name];
    if (location === undefined) {
      throw 'Undefined attrib: ' + name;
    }
    return location;
  }

  function use() {
    var prop;
    context.linkProgram(program);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      throw 'Shader program error.';
    }
    context.useProgram(program);
    for (prop in attribs) {
      attribs[prop] = getAttributeLocation(prop);
    }
    for (prop in uniforms) {
      uniforms[prop] = getUniformLocation(prop);
    }
  }

  program.getUniform = uniform;
  program.getAttrib = attrib;
  program.use = use;

  return program;
}
